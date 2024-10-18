kubectl apply -f mongo-atlas-secret.yaml
kubectl apply -f redis.yaml
kubectl apply -f deploy.yaml
# kubectl apply -f rmq.yaml
kubectl apply -f ingress.yaml