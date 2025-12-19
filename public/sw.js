self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: data.icon || '/logo.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
		scheduledAt: data.scheduledAt,
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(
		self.registration.showNotification(data.title, options)
			.catch(error => {
				console.error('Помилка при показі сповіщення:', error);
			})
	)
  }
})

self.addEventListener('notificationclick', function (event) {
	console.log('Notification click received.')
	event.notification.close()

	const data = event.notification.data;
	let url = '';

	if(data.scheduledAt) {
		url = `/events?date=${data.scheduledAt}`;
	} else {
		url = `/events`;
	}

  	event.waitUntil(clients.openWindow(url))
})