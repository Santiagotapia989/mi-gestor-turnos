import { NextResponse } from "next/server";

interface ReservaData {
  servicio: string;
  servicioId: string;
  fecha: string;
  hora: string;
  duracion: number;
  precio: number;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  notas: string;
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

    // Send data to n8n webhook
    const n8nResponse = await fetch(
      "http://localhost:5678/webhook/nuevo-turno",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          servicio,
          servicioId: body.servicioId,
          fecha,
          hora,
          duracion: body.duracion,
          precio: body.precio,
          clienteNombre,
          clienteEmail,
          clienteTelefono,
          notas: body.notas,
          fechaCreacion: new Date().toISOString(),
        }),
      }
    );

    // Log the response received from n8n (status + body, even if empty)
    let n8nBody: unknown = null;
    try {
      const rawBody = await n8nResponse.text();
      n8nBody = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      n8nBody = null;
    }
    console.log(
      "[n8n webhook] status:",
      n8nResponse.status,
      "| body:",
      n8nBody
    );

    // Only report success to the frontend if n8n responded with 200 or 201
    if (n8nResponse.status !== 200 && n8nResponse.status !== 201) {
      console.warn("n8n webhook responded with status:", n8nResponse.status);
      return NextResponse.json(
        {
          error: "El servicio de reservas no respondió correctamente",
          status: n8nResponse.status,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reserva procesada exitosamente",
        reserva: {
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
