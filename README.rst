============
Requirements
============

* Wirecloud 0.3.0
* A PubSub server (https://svn.forge.morfeo-project.org/4caast/trunk/WP6/pubsub)

Usage
-----

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
        'wirecloud_pubsub',
        ...
    )

Don't forget to run the collectstatic and compress commands on your Wirecloud
installation: ::

    $ ./manage.py collectstatic
    $ ./manage.py compress
