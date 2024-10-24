self.addEventListener('push', function(event) {

    var data = event.data.json();

    self.registration.showNotification(data.notification.title, {

        body: data.notification.body,

        icon: '/path/to/icon.png'

    });

});