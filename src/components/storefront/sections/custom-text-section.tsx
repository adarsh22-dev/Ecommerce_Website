"use client";

interface CustomTextSectionProps {
  title?: string;
  settings: {
    content_html?: string;
  };
}

export function CustomTextSection({ title, settings }: CustomTextSectionProps) {
  if (!settings.content_html && !title) return null;

  return (
    <section className="section-padding">
      <div className="container-xl">
        {title && (
          <h2 className="font-serif text-section-heading text-foreground text-center mb-8">{title}</h2>
        )}
        {settings.content_html && (
          <div
            className="prose prose-sm max-w-none mx-auto"
            dangerouslySetInnerHTML={{ __html: settings.content_html }}
          />
        )}
      </div>
    </section>
  );
}
