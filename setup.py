#!/usr/bin/python

import os
from setuptools import setup, findall
from distutils.command.install import INSTALL_SCHEMES


ROOT = os.path.abspath(os.path.dirname(__file__))


for scheme in INSTALL_SCHEMES.values():
    scheme['data'] = scheme['purelib']


packages, data_files = [], []
for dirpath, dirnames, filenames in os.walk('wirecloud_pubsub'):
    # Ignore dirnames that start with '.'
    for i, dirname in enumerate(dirnames):
        if dirname.startswith('.'): del dirnames[i]
    if '__init__.py' not in filenames:
        data_files.append([dirpath, [os.path.join(dirpath, f) for f in filenames]])

data_files.append(('wirecloud_pubsub', ('README.rst',)))

setup(
    name='wirecloud-pubsub',
    version=__import__('wirecloud_pubsub').__version__,
    description='Wirecloud plugin providing PubSub support.',
    long_description=open(os.path.join(ROOT, 'README.rst')).read(),
    author='CoNWeT Lab',
    author_email='wirecloud-pubsub@conwet.com',
    url='http://github.com/conwetlab/wirecloud-pubsub',
    license='EUPL 1.1',
    packages=('wirecloud_pubsub',),
    include_package_data=True,
    data_files=data_files,
    install_requires=('Wirecloud>=0.6.0b3',),
    tests_require=('Django',),
    classifiers=(
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: European Union Public Licence 1.1 (EUPL 1.1)',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
    )
)
