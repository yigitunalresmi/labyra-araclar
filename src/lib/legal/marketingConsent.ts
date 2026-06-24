// Ticari Elektronik İleti — Açık Rıza & Aydınlatma Metni.
// Sürüm değişirse VERSION'ı güncelle (onay kayıtlarında saklanır → ispat/İYS için).
export const MARKETING_CONSENT_VERSION = "2026-06-19";

// ⚠️ Bu bilgileri kendi yasal işletme bilgilerinle DOLDUR (ünvan/MERSİS/adres/iletişim).
export const VERI_SORUMLUSU = {
  unvan: "Labyra", // örn. "Labyra Yazılım ve Teknoloji Ltd. Şti."
  mersis: "", // MERSİS numarası
  adres: "", // açık adres
  iletisimEposta: "destek@labyra.co",
};

export type ConsentSection = { baslik: string; icerik: string };

export const MARKETING_CONSENT_SECTIONS: ConsentSection[] = [
  {
    baslik: "Onayın kapsamı",
    icerik:
      "Bu onayı vererek, Labyra'nın sunduğu ürün ve hizmetlere ilişkin kampanya, indirim, yenilik, tanıtım, anket ve bilgilendirme içerikli ticari elektronik iletileri E-POSTA yoluyla almayı kabul edersiniz.",
  },
  {
    baslik: "İsteğe bağlıdır",
    icerik:
      "Bu onay tamamen isteğe bağlıdır. Onay vermemeniz; ücretsiz hesabınızı açmanıza ve araçların tamamını kullanmanıza hiçbir şekilde engel değildir.",
  },
  {
    baslik: "Veri sorumlusu",
    icerik:
      "Ticari elektronik iletiler, veri sorumlusu sıfatıyla " +
      VERI_SORUMLUSU.unvan +
      " tarafından gönderilir. Sorularınız için: " +
      VERI_SORUMLUSU.iletisimEposta +
      ".",
  },
  {
    baslik: "İşlenen kişisel veriler",
    icerik:
      "Bu amaçla ad-soyad ve e-posta adresiniz işlenir. İşleme amacı yalnızca size tanıtım/pazarlama içerikli ileti gönderilmesidir. Verileriniz, onayınızı geri çekene kadar saklanır.",
  },
  {
    baslik: "Onayı geri çekme (ret hakkı)",
    icerik:
      "Dilediğiniz zaman, size gönderilen her e-postanın altındaki 'Abonelikten çık' bağlantısına tıklayarak veya İleti Yönetim Sistemi (İYS) üzerinden onayınızı ücretsiz olarak geri çekebilirsiniz. Ret talebiniz derhâl işleme alınır.",
  },
  {
    baslik: "İleti Yönetim Sistemi (İYS)",
    icerik:
      "6563 sayılı Kanun gereği onayınız İYS'ye kaydedilir. Onay ve ret durumunuzu istediğiniz zaman İYS (iys.org.tr) üzerinden görüntüleyip yönetebilirsiniz.",
  },
  {
    baslik: "KVKK kapsamındaki haklarınız",
    icerik:
      "Kişisel verileriniz 6698 sayılı KVKK kapsamında, verdiğiniz açık rızaya dayanılarak işlenir. KVKK'nın 11. maddesinde sayılan haklarınızı (bilgi talebi, düzeltme, silme vb.) " +
      VERI_SORUMLUSU.iletisimEposta +
      " adresine başvurarak kullanabilirsiniz.",
  },
];

// Kısa kutu etiketi (checkbox yanında görünen metin)
export const MARKETING_CONSENT_LABEL =
  "Labyra'dan kampanya, yenilik ve tanıtım e-postaları almak istiyorum.";
