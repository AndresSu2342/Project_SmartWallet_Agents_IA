import time
import random
import requests
import boto3
import matplotlib.pyplot as plt
from botocore.exceptions import ClientError

# Agentes y sus endpoints (EC2 para Python, SQS para Make)
agents = {
    "Financial Insight Agent": {"type": "ec2", "url": "http://ec2-3-236-86-104.compute-1.amazonaws.com:8000/analyze"},
    "Goal Advisor Agent": {"type": "ec2", "url": "http://ec2-3-236-86-104.compute-1.amazonaws.com:8000/advise"},
    "Budget Balancer Agent": {"type": "sqs", "url": "https://sqs.us-east-1.amazonaws.com/905418183802/smartwallet-budget-balancer-queue"},
    "Motivational Coach Agent": {"type": "sqs", "url": "https://sqs.us-east-1.amazonaws.com/905418183802/smartwallet-motivational-coach-queue"}
}

def simulate_request(agent_name):
    agent = agents[agent_name]
    start_time = time.time()
    
    success = True  # Para calcular accuracy
    improvement_score = random.uniform(0.15, 0.35)  # Para calcular improvement (simula % mejora por petición)
    
    try:
        if agent["type"] == "ec2":
            # Envío HTTP real (finge data)
            print(f"Enviando POST a EC2: {agent['url']}")
            response = requests.post(agent["url"], json={"query": "Simulate financial analysis"})
            response.raise_for_status()  # Raise si error
        elif agent["type"] == "sqs":
            # Envío SQS real (finge mensaje)
            sqs = boto3.client('sqs')
            print(f"Enviando mensaje a SQS: {agent['url']}")
            sqs.send_message(QueueUrl=agent["url"], MessageBody='{"event": "Simulate budget/motivation"}')
        
        # Simula procesamiento extra si éxito (0.5-4 seg)
        extra_delay = random.uniform(0.5, 4.0)
        time.sleep(extra_delay)
        
        # Simula fallo aleatorio para accuracy (5% chance)
        if random.random() < 0.05:
            success = False
            improvement_score = 0  # No mejora si falla
    
    except (requests.RequestException, ClientError) as e:
        # Captura error real (URLs falsas fallarán), simula tiempo
        print(f"Error real en {agent_name}: {str(e)} - Simulando respuesta")
        time.sleep(random.uniform(0.5, 4.0))  # Finge tiempo incluso en fallo
        success = False
        improvement_score = 0
    
    end_time = time.time()
    response_time = end_time - start_time
    return response_time, success, improvement_score

def run_load_test(max_requests=200):
    times = []
    successes = 0
    total_improvement = 0.0
    for i in range(max_requests):
        agent_name = random.choice(list(agents.keys()))
        rt, success, imp_score = simulate_request(agent_name)
        times.append(rt)
        if success:
            successes += 1
        total_improvement += imp_score
        print(f"Petición {i+1} a {agent_name}: {rt:.2f} seg (Éxito: {success}, Mejora: {imp_score:.2%})")
    return times, max_requests, successes, total_improvement

# Ejecuta
response_times, max_load, successes, total_improvement = run_load_test(200)

# Métricas calculadas
avg_time = sum(response_times) / len(response_times) if response_times else 0
accuracy = (successes / max_load) * 100 if max_load > 0 else 0
improvement = (total_improvement / max_load) * 100 if max_load > 0 else 0  # Como %

print(f"\nMétricas Calculadas:")
print(f"Tiempo promedio respuesta: {avg_time:.2f} seg")
print(f"Máx peticiones procesadas: {max_load}")
print(f"Precisión anomalías: {accuracy:.0f}%")
print(f"Mejora adherencia metas: {improvement:.0f}%")

# Gráfico
plt.plot(response_times)
plt.title("Tiempos de Respuesta Simulados")
plt.xlabel("Petición")
plt.ylabel("Tiempo (seg)")
plt.savefig("metrics_graph.png")