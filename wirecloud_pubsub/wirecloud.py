from ezweb.plugins import WirecloudPlugin
from wirecloud_pubsub import VERSION


class PubSubPlugin(WirecloudPlugin):

    features = {
        'PubSub': '.'.join(map(str, VERSION)),
    }

    def get_scripts(self, view):
        return (
            'js/lib/silbops/events.js',
            'js/lib/silbops/endpoint.js',
            'js/lib/silbops/pubendpoint.js',
            'js/lib/silbops/subendpoint.js',
            'js/lib/silbops/stream.js',
            'js/lib/silbops/silbops.js',
            'js/lib/silbops/eventsource.js',
            'js/lib/silbops/filter.js',
            'js/pubsub/PubSubManager.js',
        )

    def get_gadget_api_extensions(self, view):
        return (
            'js/EzWebAPI/PubSub.js',
        )
