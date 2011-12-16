from ezweb.plugins import WirecloudPlugin


class PubSubPlugin(WirecloudPlugin):

    features = {
        'PubSub': '0.1'
    }

    def get_scripts(self, view):
        return (
            'js/lib/silbops/events.js',
            'js/lib/silbops/endpoint.js',
            'js/lib/silbops/pubendpoint.js',
            'js/lib/silbops/stream.js',
            'js/lib/silbops/silbops.js',
            'js/lib/silbops/eventsource.js',
        )