document.addEventListener('DOMContentLoaded', function() {
    
// Открытие окна информации при загрузке страницы
document.getElementById('infoWindow').style.display = 'block';

// Обработка кнопок в окне информации
document.getElementById('continueButton').addEventListener('click', function() {
        document.getElementById('infoWindow').style.display = 'none';
        // Показать меню здесь после реализации меню
        
        // Для демонстрации просто показываем canvas
        document.getElementById('gameCanvas').style.display = 'block';
        
});

document.getElementById('channelButton').addEventListener('click', function() {
        window.open("https://t.me/plazaed", '_blank');
});

});
