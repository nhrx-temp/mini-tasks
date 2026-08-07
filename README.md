# Mini Tasks

## Kurulum ve Kullanım
1. Depoyu klonlayın:
```bash
git clone https://github.com/nhrx-temp/mini-tasks.git
cd mini-tasks/
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Çevresel değişkenleri ayarlayın: env.example dosyasını .env olarak kopyalayın ve gerekli bilgileri (MongoDB bağlantı adresi, JWT anahtarı vb.) doldurun.

4. Uygulamayı başlatın:
```bash
npm start
```

## Dosya Mimarisi
- index.js: Sunucu giriş noktası ve ana uygulama yapılandırması.
- routes/: Kimlik doğrulama (auth.js) ve görev (tasks.js) yönlendiricileri.
- models/: Mongoose veri modelleri (Task.js).
- middleware/: Güvenlik ve JWT doğrulama aracı (auth.js).
- public/: İstemci tarafı statik dosyaları (index.html ve js/app.js).

## API Endpoints
### Kimlik Doğrulama (/api/auth)
- POST /api/auth/register: Yeni kullanıcı kaydı oluşturur.
- POST /api/auth/login: Mevcut kullanıcı ile oturum açar ve JWT döndürür.

### Görev Yönetimi (/api/tasks)
- GET /api/tasks: Oturum açan kullanıcıya ait tüm görevleri listeler.
- POST /api/tasks: Yeni bir görev oluşturur.
- PUT /api/tasks/:id: Belirtilen görevi günceller (durum veya başlık).
- DELETE /api/tasks/:id: Belirtilen görevi siler.
