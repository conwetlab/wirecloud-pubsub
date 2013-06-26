from django.conf import settings

from wirecloud.platform.plugins import WirecloudPlugin
import wirecloud_pubsub


class PubSubPlugin(WirecloudPlugin):

    features = {
        'PubSub': wirecloud_pubsub.__version__,
    }

    def get_scripts(self, view):
        return (
            "js/lib/silbops/lib/eventsource.js",
            "js/lib/silbops/utils.js",
            "js/lib/silbops/events.js",
            "js/lib/silbops/model/basic/type.js",
            "js/lib/silbops/model/basic/value.js",
            "js/lib/silbops/model/basic/operator.js",
            "js/lib/silbops/model/basic/attribute.js",
            "js/lib/silbops/model/advertise.js",
            "js/lib/silbops/model/constraint.js",
            "js/lib/silbops/model/contextfunction.js",
            "js/lib/silbops/model/notification.js",
            "js/lib/silbops/model/filter.js",
            "js/lib/silbops/json-value.js",
            "js/lib/silbops/stream.js",
            "js/lib/silbops/silbops.js",
            "js/lib/silbops/endpoint.js",
            "js/pubsub/PubSubManager.js",
        )

    def get_ajax_endpoints(self, view):
        return (
            {'id': 'DEFAULT_SILBOPS_BROKER', 'url': settings.DEFAULT_SILBOPS_BROKER},
        )

    def get_old_widget_api_extensions(self, view):
        return (
            'js/WirecloudAPI/PubSub/OldWidget.js',
        )

    def get_widget_api_extensions(self, view):
        return (
            'js/WirecloudAPI/PubSub/Widget.js',
        )

    def get_operator_api_extensions(self, view):
        return (
            'js/WirecloudAPI/PubSub/Operator.js',
        )
