// Örnek veriler - Backend bağlantısı olmadığında kullanılacak
export const initialMusteriler = [
  {
    id: "1",
    adi: "Ahmet",
    soyadi: "Yılmaz",
    cinsiyet: "E",
    telefon: "5551234567",
    adres: "İstanbul, Türkiye",
    dogumTarihi: "1990-01-01",
    eposta: "ahmet@example.com",
    sifre: "hashedPassword123",
    olusturmaZamani: "2024-01-01T10:00:00.000Z",
    guncellemeZamani: "2024-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    adi: "Ayşe",
    soyadi: "Demir",
    cinsiyet: "K",
    telefon: "5559876543",
    adres: "Ankara, Türkiye",
    dogumTarihi: "1995-05-15",
    eposta: "ayse@example.com",
    sifre: "hashedPassword456",
    olusturmaZamani: "2024-01-02T11:00:00.000Z",
    guncellemeZamani: "2024-01-02T11:00:00.000Z",
  },
];

export const initialKategoriler = [
  {
    id: "1",
    kategoriAdi: "Elektronik",
    kategoriAciklama: "Elektronik ürünler kategorisi",
    olusturmaZamani: "2024-01-01T10:00:00.000Z",
    guncellemeZamani: "2024-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    kategoriAdi: "Giyim",
    kategoriAciklama: "Giyim ürünleri kategorisi",
    olusturmaZamani: "2024-01-01T10:30:00.000Z",
    guncellemeZamani: "2024-01-01T10:30:00.000Z",
  },
  {
    id: "3",
    kategoriAdi: "Kitap",
    kategoriAciklama: "Kitap ürünleri kategorisi",
    olusturmaZamani: "2024-01-01T11:00:00.000Z",
    guncellemeZamani: "2024-01-01T11:00:00.000Z",
  },
];

export const initialMarkalar = [
  {
    id: "1",
    markaAdi: "Samsung",
    markaAciklama: "Samsung Electronics",
    olusturmaZamani: "2024-01-01T10:00:00.000Z",
    guncellemeZamani: "2024-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    markaAdi: "Apple",
    markaAciklama: "Apple Inc.",
    olusturmaZamani: "2024-01-01T10:30:00.000Z",
    guncellemeZamani: "2024-01-01T10:30:00.000Z",
  },
  {
    id: "3",
    markaAdi: "Nike",
    markaAciklama: "Nike Spor Giyim",
    olusturmaZamani: "2024-01-01T11:00:00.000Z",
    guncellemeZamani: "2024-01-01T11:00:00.000Z",
  },
];

export const initialUrunler = [
  {
    id: "1",
    urunAdi: "Samsung Galaxy S21",
    urunAciklama: "Samsung Galaxy S21 Akıllı Telefon",
    urunFiyat: 15999.99,
    stokMiktari: 50,
    kategoriId: "1",
    markaId: "1",
    durum: "aktif",
    olusturmaZamani: "2024-01-01T10:00:00.000Z",
    guncellemeZamani: "2024-01-01T10:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=1",
  },
  {
    id: "2",
    urunAdi: "iPhone 13",
    urunAciklama: "Apple iPhone 13 Akıllı Telefon",
    urunFiyat: 24999.99,
    stokMiktari: 30,
    kategoriId: "1",
    markaId: "2",
    durum: "aktif",
    olusturmaZamani: "2024-01-01T11:00:00.000Z",
    guncellemeZamani: "2024-01-01T11:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=2",
  },
  {
    id: "3",
    urunAdi: "Nike Air Max",
    urunAciklama: "Nike Spor Ayakkabı",
    urunFiyat: 2499.99,
    stokMiktari: 100,
    kategoriId: "2",
    markaId: "3",
    durum: "aktif",
    olusturmaZamani: "2024-01-02T10:00:00.000Z",
    guncellemeZamani: "2024-01-02T10:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=3",
  },
  {
    id: "4",
    urunAdi: "Sony WH-1000XM4",
    urunAciklama: "Sony Aktif Gürültü Önleyici Kulaklık",
    urunFiyat: 2999.99,
    stokMiktari: 20,
    kategoriId: "3",
    markaId: "4",
    durum: "aktif",
    olusturmaZamani: "2024-01-03T09:00:00.000Z",
    guncellemeZamani: "2024-01-03T09:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=4",
  },
  {
    id: "5",
    urunAdi: "Dell XPS 13",
    urunAciklama: "Dell XPS 13 Dizüstü Bilgisayar",
    urunFiyat: 10999.99,
    stokMiktari: 15,
    kategoriId: "4",
    markaId: "5",
    durum: "aktif",
    olusturmaZamani: "2024-01-04T10:00:00.000Z",
    guncellemeZamani: "2024-01-04T10:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=5",
  },
  {
    id: "6",
    urunAdi: "Apple Watch Series 6",
    urunAciklama: "Apple Watch Series 6 Akıllı Saat",
    urunFiyat: 3999.99,
    stokMiktari: 25,
    kategoriId: "5",
    markaId: "2",
    durum: "aktif",
    olusturmaZamani: "2024-01-05T11:00:00.000Z",
    guncellemeZamani: "2024-01-05T11:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=6",
  },
  {
    id: "7",
    urunAdi: "Samsung QLED TV",
    urunAciklama: "Samsung 55 inç QLED TV",
    urunFiyat: 7999.99,
    stokMiktari: 10,
    kategoriId: "6",
    markaId: "1",
    durum: "aktif",
    olusturmaZamani: "2024-01-06T12:00:00.000Z",
    guncellemeZamani: "2024-01-06T12:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=7",
  },
  {
    id: "8",
    urunAdi: "Bose SoundLink",
    urunAciklama: "Bose SoundLink Bluetooth Hoparlör",
    urunFiyat: 1499.99,
    stokMiktari: 40,
    kategoriId: "3",
    markaId: "6",
    durum: "aktif",
    olusturmaZamani: "2024-01-07T13:00:00.000Z",
    guncellemeZamani: "2024-01-07T13:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=8",
  },
  {
    id: "9",
    urunAdi: "Fitbit Charge 4",
    urunAciklama: "Fitbit Charge 4 Akıllı Bileklik",
    urunFiyat: 899.99,
    stokMiktari: 50,
    kategoriId: "5",
    markaId: "7",
    durum: "aktif",
    olusturmaZamani: "2024-01-08T14:00:00.000Z",
    guncellemeZamani: "2024-01-08T14:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=9",
  },
  {
    id: "10",
    urunAdi: "GoPro Hero 9",
    urunAciklama: "GoPro Hero 9 Aksiyon Kamerası",
    urunFiyat: 3499.99,
    stokMiktari: 15,
    kategoriId: "7",
    markaId: "8",
    durum: "aktif",
    olusturmaZamani: "2024-01-09T15:00:00.000Z",
    guncellemeZamani: "2024-01-09T15:00:00.000Z",
    urunResmi: "https://picsum.photos/200/300?random=10",
  },
];

export const initialSiparisler = [];
