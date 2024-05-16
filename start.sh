export RESOURCE=service.namespace=tutorial,service.version=1.0,service.instance.id=`uuidgen`,host.name=${HOSTNAME},host.type=`uname -m`,os.name=`uname -s`,os.version=`uname -r`
echo ${RESOURCE}
env OTEL_SERVICE_NAME='app.js' OTEL_RESOURCE_ATTRIBUTES=${RESOURCE} npm start