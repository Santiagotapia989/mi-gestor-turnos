import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

interface ReservaData {
  servicio: string;
  servicioId?: string;
  fecha: string;
  hora: string;
  duracion?: number;
  precio?: number;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  notas?: string;
}

export async function POST(request: Request) {
  try {
    const body: ReservaData = await request.json();

    // Validate required fields
    const {
      servicio,
      fecha,
      hora,
      clienteNombre,
      clienteEmail,
      clienteTelefono,
    } = body;

    if (
      !servicio ||
      !fecha ||
      !hora ||
      !clienteNombre ||
      !clienteEmail ||
      !clienteTelefono
    ) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clienteEmail)) {
      return NextResponse.json(
        { error: "El formato del email no es válido" },
        { status: 400 }
      );
    }

    // Validate fecha format
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      return NextResponse.json(
        { error: "El formato de la fecha no es válido" },
        { status: 400 }
      );
    }

    // Save reservation to the database
    const reserva = await prisma.reserva.create({
      data: {
        servicio,
        servicioId: body.servicioId || "",
        fecha: fechaDate,
        hora,
        duracion: body.duracion || 0,
        precio: body.precio || 0,
        clienteNombre,
        clienteEmail,
        clienteTelefono,
        notas: body.notas || null,
      },
    });

    // Send confirmation email via Resend (without failing the booking if it errors)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const emailResult = await resend.emails.send({
        from:
          process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: [clienteEmail],
        subject: `Confirmación de reserva - ${servicio}`,
        text: `Hola ${clienteNombre},

Tu turno fue reservado con exito. Estos son los datos:

- Servicio: ${servicio}
- Fecha: ${fecha}
- Hora: ${hora}
- Duracion: ${body.duracion ? `${body.duracion} min` : "-"}
- Precio: ${body.precio ? `$${body.precio}` : "-"}

Si necesitas modificar o cancelar tu turno, no dudes en contactarnos.

Saludos,
Centro Medico Digital`,
      });
      console.log("Resend Result:", emailResult);
    } catch (error) {
      console.error("Error enviando mail con Resend:", error);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reserva procesada exitosamente",
        reserva: {
          id: reserva.id,
          servicio,
          fecha,
          hora,
          cliente: clienteNombre,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error procesando reserva:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}