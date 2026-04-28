#!/bin/bash

echo "🔍 Tarkistetaan portit 1974-1976..."

# Tarkista ja sammuta portit 1974-1976
for port in 1974 1975 1976; do
    # Hae prosessi PID joka käyttää porttia
    pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pid" ]; then
        echo "🔥 Sammutetaan prosessi $pid portista $port"
        kill -9 $pid 2>/dev/null
        sleep 1
        
        # Tarkista vielä kerran
        pid2=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pid2" ]; then
            echo "⚠️  Pakkosammutetaan prosessi $pid2 portista $port"
            kill -KILL $pid2 2>/dev/null
        else
            echo "✅ Portti $port vapautettu"
        fi
    else
        echo "✅ Portti $port on vapaa"
    fi
done

echo ""
echo "🚀 Käynnistetään development server..."
echo ""

# Käynnistä npm run dev
npm run dev