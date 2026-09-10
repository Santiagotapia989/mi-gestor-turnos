import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reservas = await prisma.reserva.findMany({
      orderBy: { fechaCreacion: "asc" },
    });

    const rows = reservas.map((r) => ({
      servicio: r.servicio,
      servicioId: r.servicioId,
      fecha: r.fecha.toISOString().split("T")[0],
      hora: r.hora,
      duracion: r.duracion,
      precio: r.precio,
      clienteNombre: r.clienteNombre,
      clienteEmail: r.clienteEmail,
      clienteTelefono: r.clienteTelefono,
      notas: r.notas ?? "",
      fechaCreacion: r.fechaCreacion.toISOString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Turnos");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=turnos.xlsx",
      },
    });
  } catch (error) {
    console.error("Error exportando turnos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}