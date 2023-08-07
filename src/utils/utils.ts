export const getRandomInteger = () => {
    // Math.random() fonksiyonu 0 ile 1 arasında rastgele bir sayı üretir (1 dahil değil).
    // Bu yüzden 1 ile 11 arasında (1 ve 11 dahil) bir sayı elde etmek için aşağıdaki işlemler yapılır.
    var randomNumber = Math.floor(Math.random() * 10) + 1;
    return randomNumber;
}

