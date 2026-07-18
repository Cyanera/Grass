import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import type { NewOrder, Order } from "./orders";
import type { ProductId } from "./products";

/**
 * مخزن الطلبات الدائم عبر Supabase (للإنتاج).
 * يتطلّب متغيّري البيئة: SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY.
 *
 * مخطط الجدول المطلوب (نفّذيه في محرّر SQL بـ Supabase):
 *   create table public.orders (
 *     id uuid primary key,
 *     product_id text not null,
 *     email text not null,
 *     status text not null,
 *     story jsonb not null,
 *     photo text,
 *     result jsonb,
 *     error text,
 *     created_at bigint not null
 *   );
 *   alter table public.orders enable row level security; -- المفتاح الخدمي يتجاوزها
 */

const TABLE = "orders";

// أعمدة قاعدة البيانات (snake_case) مقابل حقول Order.
type Row = {
  id: string;
  product_id: string;
  email: string;
  status: Order["status"];
  story: Order["story"];
  photo: string | null;
  result: Order["result"] | null;
  error: string | null;
  created_at: number;
};

function rowToOrder(r: Row): Order {
  return {
    id: r.id,
    productId: r.product_id as ProductId,
    email: r.email,
    status: r.status,
    story: r.story,
    photo: r.photo ?? undefined,
    result: r.result ?? undefined,
    error: r.error ?? undefined,
    createdAt: Number(r.created_at),
  };
}

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
  }
  return client;
}

export const supabaseOrderStore = {
  async create(input: NewOrder): Promise<Order> {
    const order: Order = {
      id: randomUUID(),
      status: "pending",
      createdAt: Date.now(),
      ...input,
    };
    const { error } = await db()
      .from(TABLE)
      .insert({
        id: order.id,
        product_id: order.productId,
        email: order.email,
        status: order.status,
        story: order.story,
        photo: order.photo ?? null,
        result: null,
        error: null,
        created_at: order.createdAt,
      });
    if (error) throw new Error(`SUPABASE_INSERT: ${error.message}`);
    return order;
  },

  async get(id: string): Promise<Order | null> {
    const { data, error } = await db()
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`SUPABASE_GET: ${error.message}`);
    return data ? rowToOrder(data as Row) : null;
  },

  async update(id: string, patch: Partial<Order>): Promise<Order | null> {
    const set: Record<string, unknown> = {};
    if ("status" in patch) set.status = patch.status;
    if ("result" in patch) set.result = patch.result ?? null;
    if ("error" in patch) set.error = patch.error ?? null;
    if ("photo" in patch) set.photo = patch.photo ?? null;
    if ("email" in patch) set.email = patch.email;

    const { data, error } = await db()
      .from(TABLE)
      .update(set)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(`SUPABASE_UPDATE: ${error.message}`);
    return data ? rowToOrder(data as Row) : null;
  },
};
