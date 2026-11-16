TaskFlow – Görev Yönetim Sistemi

TaskFlow, projelerin, çalışanların ve görevlerin yönetilmesini sağlayan Node.js ve Express.js tabanlı bir REST API uygulamasıdır. Uygulama üzerinden proje ve çalışan oluşturma, görev atama, görevleri listeleme, filtreleme, güncelleme ve silme işlemleri gerçekleştirilebilir.

Kullanılan Teknolojiler

Node.js: Sunucu tarafı JavaScript çalışma ortamı.

Express.js: REST API geliştirme ve HTTP isteklerini yönetme.

JavaScript: Uygulama iş mantığının geliştirilmesi.

File System (fs): Verilerin dosyalar üzerinden okunması ve güncellenmesi.

Proje Özellikleri

Proje oluşturma, listeleme, güncelleme ve silme.

Çalışan oluşturma, listeleme, güncelleme ve silme.

Görev oluşturma, listeleme, güncelleme ve silme.

Görevlerin projelerle ve çalışanlarla ilişkilendirilmesi.

Görevleri belirli kriterlere göre filtreleme.

Projelere çalışan ekleme.

HTTP isteklerinin Middleware aracılığıyla loglanması.

Proje Klasör Yapısı

Kurulum ve Çalıştırma

1. Gereksinimler

Projeyi çalıştırmadan önce aşağıdaki araçların bilgisayarınızda kurulu olması gerekir:

Node.js

Git

API isteklerini test etmek için Postman veya benzeri bir araç (isteğe bağlı).

2. Projeyi Klonlama

Terminal veya komut satırını açarak projeyi bilgisayarınıza klonlayın:

git clone https://github.com/0zg0z/TaskFlow-G-rev-y-netim-sistemi.git

Ardından proje klasörüne geçin:

cd TaskFlow-G-rev-y-netim-sistemi

3. Bağımlılıkların Yüklenmesi

Gerekli Node.js paketlerini yüklemek için aşağıdaki komutu çalıştırın:

npm install

Bu komut, package.json dosyasında tanımlanan bağımlılıkları yükler.

4. Sunucunun Başlatılması

Projeyi çalıştırmak için aşağıdaki komutu kullanın:

node app.js

Sunucu başarıyla başlatıldığında terminalde aşağıdaki mesaj görüntülenir:

Example app listening on port 3000

Uygulama artık aşağıdaki adres üzerinden erişilebilir:

http://localhost:3000

Ana endpoint üzerinden sunucunun çalıştığı kontrol edilebilir:

GET http://localhost:3000/
