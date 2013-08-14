from wirecloud.commons.utils.testcases import wirecloud_selenium_test_case, WirecloudSeleniumTestCase

@wirecloud_selenium_test_case
class BasicTestCase(WirecloudSeleniumTestCase):

    def test_silbops_available_to_widgets(self):

        self.login()

        resource = self.add_packaged_resource_to_catalogue('Wirecloud_silbops-test-widget_1.0.wgt', 'Wirecloud SilboPS API test widget')
        iwidget = self.instantiate(resource)

        with iwidget:
            body = self.driver.find_element_by_tag_name('body')
            self.assertEqual(body.text, 'Success')
    test_silbops_available_to_widgets.tags = ('fiware-ut-10',)
