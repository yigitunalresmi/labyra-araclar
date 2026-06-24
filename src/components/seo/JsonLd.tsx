// JSON-LD yapısal veri enjekte eder. Veri kendi içeriğimiz → XSS riski yok.
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
