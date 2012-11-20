============
Requirements
============

* Wirecloud 0.3.0
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

Once wirecloud-pubsub is installed and activated, gadgets can take advantage of
the PubSub functionallities through EzWebAPI.SilboPS. Currently,
EzWebAPI.SilboPS only exports PubEndPoint, SubEndPoint and Filter classes. Full
documentation of SilboPS is available at
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

    endpoint = new EzWebAPI.SilboPS.PubEndPoint({
        onopen: function(endpoint) {
            alert('Endpoint ready');
            start_publishing();
        },
        onclose: function(endpoint) {
            alert('Endpoint closed');
        }
    });


Subscription
............

::
    var endpoint, filter;

    filter = new EzWebAPI.SilboPS.Filter();
    filter.constrain('fqn').startsWith('es.upm.fi.')
            .constrain('eventType').eq('monitoring');

    endpoint = new EzWebAPI.SilboPS.SubEndPoint({
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
