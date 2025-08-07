import { NextResponse } from 'next/server';
import { summarizeDiscussion } from '@/ai/flows/summarize-discussion';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi input (opsional tapi disarankan)
    if (!body || typeof body.discussion !== 'string' || body.discussion.trim() === '') {
      return NextResponse.json({ error: 'Input diskusi tidak valid' }, { status: 400 });
    }

    const result = await summarizeDiscussion({ discussion: body.discussion });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menyimpulkan diskusi' }, { status: 500 });
  }
}
