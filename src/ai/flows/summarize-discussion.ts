type SummarizeInput = {
    discussion: string;
  };
  
  type SummarizeOutput = {
    summary: string;
  };
  
  export async function summarizeDiscussion({ discussion }: SummarizeInput): Promise<SummarizeOutput> {
    // Placeholder summarization logic
    const summary = `Ringkasan otomatis: "${discussion.slice(0, 100)}..."`;
  
    return {
      summary,
    };
  }
  