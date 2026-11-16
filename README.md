# Görev Akışı — React görev yönetimi

## Özellikler
- React 18 + Vite + JavaScript
- Görev ekleme, düzenleme, silme ve tamamlandı işaretleme
- Kategori, durum ve metin arama filtreleri; son tarihe göre sıralama
- Toplam/aktif/tamamlanan/geciken sayaçları ve ilerleme göstergesi
- LocalStorage ile tarayıcıda kalıcı kayıt
- Ayrı Express REST API örneği (`/api/health`, `/api/tasks`)

## Kurulum
1. Node.js 18+ kurun.
2. `npm install`
3. `npm run dev` ile arayüzü başlatın.
4. İsteğe bağlı API için ikinci terminalde `npm run server` çalıştırın.
5. Üretim derlemesi: `npm run build`; önizleme: `npm run preview`.

## Mimari not
Arayüzün kalıcı veri katmanı şu an LocalStorage'dır. Express API ayrı bir örnek servis olarak pakete eklenmiştir; frontend ile API senkronizasyonu bağlanmamıştır. Bu nedenle arayüzün temel CRUD işlemleri API olmadan da çalışır.

## Yapay zekâ kullanımı
ChatGPT; ilk gereksinimlerin ayrıştırılması, React bileşen iskeleti, arayüz metinleri, filtreleme/CRUD mantığı ve hata kontrol listesi için yardımcı olarak kullanılmıştır. Üretilen kod proje içinde gözden geçirilmiş; son kullanıcı davranışı ve kurulum geliştirici tarafından doğrulanmalıdır.

## Ekran görüntüsü
`docs/uygulama-ekrani.png` dosyası arayüzün statik tasarım önizlemesidir; paket bağımlılıkları bu ortamda kurulamadığı için çalışan uygulamadan alınmış canlı ekran görüntüsü olarak sunulmamaktadır.

## GitHub ve canlı yayın
Teslim yönergesi public GitHub deposu ve Netlify/Vercel canlı bağlantısı istiyor. Bu paket kaynak kodunu ve dağıtım yapılandırmasını içerir; hesap sahibinin GitHub ve hosting hesabında yayınlama/bağlantı kurma adımı bu çalışma ortamından tamamlanamaz. Depo ve canlı URL alanları yayın sonrası teslim formuna eklenmelidir.
