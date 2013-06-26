from django.conf import settings

from wirecloud.platform.plugins import WirecloudPlugin
import wirecloud_pubsub


class PubSubPlugin(WirecloudPlugin):

    features = {
        'PubSub': wirecloud_pubsub.__version__,
    }

    def get_scripts(self, view):
        return (
            "js/lib/prototype.js",
            "js/lib/eventsource.js",
            "js/utils.js",
            "js/events.js",
            "js/model/basic/type.js",
            "js/model/basic/value.js",
            "js/model/basic/operator.js",
            "js/model/basic/attribute.js",
            "js/model/advertise.js",
            "js/model/constraint.js",
            "js/model/contextfunction.js",
            "js/model/notification.js",
            "js/model/filter.js",
            "js/json-value.js",
            "js/stream.js",
            "js/silbops.js",
            "js/endpoint.js",
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
