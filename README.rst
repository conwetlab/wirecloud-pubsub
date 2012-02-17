============
Requirements
============

* Wirecloud 0.3.0
* A PubSub server (https://svn.forge.morfeo-project.org/4caast/trunk/WP6/pubsub)

Installation
------------

Since *wirecloud_pubsub* uses django.contrib.static functionalities, you should
add it to your ``INSTALLED_APPS`` in ``settings.py``: ::

    INSTALLED_APPS = (
        ...
        'wirecloud_pubsub',
        ...
    )

Also you have to add it to your ``WIRECLOUD_PLUGINS``: ::

    WIRECLOUD_PLUGINS = (
        ...
        'wirecloud_pubsub.wirecloud.PubSubPlugin',
        ...
    )

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

Example
------

::

    var endpoint;

    function publish() {
        endpoint.publish({'value': 'Hello world!'});
    }

    function start_publishing() {
        endpoint.advertise({'value', ['str']});
        setInterval(publish, 2000);
    }

    endpoint = EzWebAPI.SilboPS.PubEndPoint({
        onopen: function(endpoint) {
            alert('Endpoint ready');
            start_publishing();
        },
        onclose: function(endpoint) {
            alert('Endpoint closed');
        }
    })
