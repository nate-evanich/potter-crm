import { prisma } from "@/lib/prisma";
import type { ContractCreateInput, ContractUpdateInput } from "@/lib/validation/contracts";

export function listContracts(userId: string, clientId?: string) {
  return prisma.contract.findMany({
    where: { userId, ...(clientId ? { clientId } : {}) },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true } },
      items: { select: { quantity: true, priceCents: true } },
      payments: { select: { amountCents: true } },
    },
  });
}

export function getContract(userId: string, id: string) {
  return prisma.contract.findFirst({
    where: { id, userId },
    include: {
      client: true,
      items: {
        include: { offering: { select: { id: true, name: true, category: true } } },
        orderBy: { createdAt: "asc" },
      },
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
}

export async function createContract(userId: string, data: ContractCreateInput) {
  const offerings = await prisma.offering.findMany({
    where: { userId, id: { in: data.items.map((i) => i.offeringId) } },
    select: { id: true, priceCents: true },
  });
  const priceMap = new Map(offerings.map((o) => [o.id, o.priceCents]));

  for (const it of data.items) {
    if (!priceMap.has(it.offeringId)) {
      throw new Error("One or more offerings are invalid");
    }
  }

  const client = await prisma.client.findFirst({
    where: { id: data.clientId, userId },
    select: { id: true },
  });
  if (!client) throw new Error("Client not found");

  return prisma.contract.create({
    data: {
      userId,
      clientId: data.clientId,
      title: data.title,
      status: data.status,
      startDate: data.startDate,
      dueDate: data.dueDate,
      notes: data.notes,
      items: {
        create: data.items.map((it) => ({
          offeringId: it.offeringId,
          quantity: it.quantity,
          priceCents: priceMap.get(it.offeringId)!,
        })),
      },
    },
  });
}

export async function updateContract(userId: string, id: string, data: ContractUpdateInput) {
  const client = await prisma.client.findFirst({
    where: { id: data.clientId, userId },
    select: { id: true },
  });
  if (!client) throw new Error("Client not found");

  const result = await prisma.contract.updateMany({
    where: { id, userId },
    data: {
      clientId: data.clientId,
      title: data.title,
      status: data.status,
      startDate: data.startDate,
      dueDate: data.dueDate,
      notes: data.notes,
    },
  });
  if (result.count === 0) throw new Error("Contract not found");
}

export async function deleteContract(userId: string, id: string) {
  const result = await prisma.contract.deleteMany({ where: { id, userId } });
  if (result.count === 0) throw new Error("Contract not found");
}
