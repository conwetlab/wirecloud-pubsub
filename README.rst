============
Requirements
============

* Wirecloud 0.4.0
* A PubSub server (https://svn.forge.morfeo-project.org/4caast/trunk/WP6/pubsub)

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

You also have to add it to your ``WIRECLOUD_PLUGINS``: ::

    WIRECLOUD_PLUGINS = (
        ...
        'wirecloud_pubsub.plugins.PubSubPlugin',
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
MashupApplication.SilboPS object. Currently, the MashupApplication.SilboPS
object only exports the PubEndPoint, SubEndPoint and Filter classes defined by
the original javascript bindings provided by SilboPS. Full documentation of
SilboPS is available at
https://svn.forge.morfeo-project.org/4caast/trunk/WP6/pubsub/README.md.

Examples
--------

Publishing
..........

::

    var endpoint;

    function publish() {
        endpoint.publish({'value': 'Hello world!'});
    }

    function start_publishing() {
        endpoint.advertise({'value', ['str']});
        setInterval(publish, 2000);
    }

    endpoint = new MashupApplication.SilboPS.PubEndPoint({
        onopen: function(endpoint) {
            alert('Endpoint ready');
            start_publishing();
        },
        onclose: function(endpoint) {
            alert('Endpoint closed');
        }
    });


Subscribing
...........

::

    var endpoint, filter;

    filter = new MashupApplication.SilboPS.Filter();
    filter.constrain('fqn').startsWith('es.upm.fi.')
            .constrain('eventType').eq('monitoring');

    endpoint = new MashupApplication.SilboPS.SubEndPoint({
        onopen: function (endpoint) {
            endpoint.subscribe(filter);
            alert('Endpoint ready');
        },
        onclose: function (endpoint) {
            alert('Endpoint closed');
        },
        onnotify: function (endpoint, data) {
            var notification = data.notification;
            alert(notification.fqn);
        }
    });
