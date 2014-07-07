============
Requirements
============

* Wirecloud 0.6.0
* A PubSub server (https://github.com/conwetlab/silbops)

Installation
------------

You can get wirecloud-pubsub from PyPI with... ::

    # pip install wirecloud-pubsub

Since *wirecloud_pubsub* uses django.contrib.static functionalities, you should
add it to your ``INSTALLED_APPS`` in ``settings.py``: ::

    INSTALLED_APPS = (
        ...
        'wirecloud_pubsub',
        ...
    )

As last step, add a ``DEFAULT_SILBOPS_BROKER`` setting with the URL of the
broker to use: ::

    DEFAULT_SILBOPS_BROKER = 'http://pubsub.server.com:8080/silbops/CometAPI'

Don't forget to run the collectstatic and compress commands on your Wirecloud
installation: ::

    $ ./manage.py collectstatic
    $ ./manage.py compress


Usage
-----

Once wirecloud-pubsub is installed and activated, widgets and operators can
take advantage the PubSub functionallities through the
MashupPlatform.SilboPS object. Currently, the MashupPlatform.SilboPS
object only exports the PubEndPoint, SubEndPoint and Filter classes defined by
the original javascript bindings provided by SilboPS. Full documentation of
SilboPS is available at https://github.com/conwetlab/silbops.

Examples
--------

Publishing
..........

::

    var endpoint;

    function publish() {
        var notification = new MashupPlatform.SilboPS.Notification()
            .attribute("value", SilboPS.Type.LONG, Math.floor((Math.random() * 100) + 1))
            .attribute("fqn", SilboPS.Type.STRING, "es.upm.fi.machine1")
            .attribute("eventType", SilboPS.Type.STRING, "monitoring.cpu");
    }

    function start_publishing() {
        var advertise = new MashupPlatform.SilboPS.Advertise()
            .attribute("value", SilboPS.Type.LONG)
            .attribute("fqn", SilboPS.Type.STRING)
            .attribute("eventType", SilboPS.Type.STRING);

        endpoint.advertise(advertise);
        setInterval(publish, 2000);
    }

    endpoint = new MashupPlatform.SilboPS.PubEndPoint({
        open: function(endpoint) {
            alert('Endpoint ready');
            start_publishing();
        },
        close: function(endpoint) {
            alert('Endpoint closed');
        }
    });


Subscribing
...........

::

    var endpoint, filter;

    function create_subscription() {
        var cxtFunc = new SilboPS.ContextFunction();
        var subscription = new SilboPS.Subscription()
            .constrain("fqn", SilboPS.Type.STRING).startsWith("es.upm.fi.")
            .constrain("eventType", SilboPS.Type.STRING).eq("es.upm.fi.")
            .subscription();

            endpoint.subscribe(subscription, cxtFunc);
    };

    endpoint = new MashupPlatform.SilboPS.SubEndPoint({
        open: function (endpoint) {
            endpoint.subscribe(filter);
            alert('Endpoint ready');
        },
        close: function (endpoint) {
            alert('Endpoint closed');
        },
        notify: function (endpoint, data) {
            var notification = data.notification;
            alert(notification.value);
        }
    });
