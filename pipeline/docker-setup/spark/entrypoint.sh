#!/bin/bash

SPARK_WORKLOAD=$1

echo "SPARK_WORKLOAD: $SPARK_WORKLOAD"

if [ "$SPARK_WORKLOAD" == "master" ]; then
  $SPARK_HOME/sbin/start-master.sh -p 7077
  tail -f $SPARK_HOME/logs/*master*.out  # Giữ container sống
elif [ "$SPARK_WORKLOAD" == "worker" ]; then
  $SPARK_HOME/sbin/start-worker.sh spark://spark-master:7077
  tail -f $SPARK_HOME/logs/*worker*.out  # Giữ container sống
elif [ "$SPARK_WORKLOAD" == "history" ]; then
  $SPARK_HOME/sbin/start-history-server.sh
  tail -f $SPARK_HOME/logs/*history*.out  # Giữ container sống
fi
