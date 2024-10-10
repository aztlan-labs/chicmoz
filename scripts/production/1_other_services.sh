kubectl scale statefulset --replicas 1 -n chicmoz-prod kafka-controller
kubectl scale statefulset --replicas 1 -n chicmoz-prod redis-master
kubectl scale statefulset --replicas 1 -n chicmoz-prod redis-replicas
kubectl scale statefulset --replicas 1 -n chicmoz-prod postgresql
