# Geospatial AI Agent for Disaster Monitoring & Response

**Project for Orion Astrathon (AstraX Xpecto 2025, IIT Mandi)**

## Project Overview

This project implements a solution inspired by the **Geospatial AI Challenge (Bonus Problem Statement)** of the Orion Astrathon. It combines a Fetch.ai agent (`uagents`) for autonomous monitoring with a Flask web API to provide real-time insights and support related to geospatial events, focusing specifically on disaster management.

The core idea is to leverage AI capabilities to process geospatial event data, identify potential disasters, and offer immediate information, such as relevant emergency contacts and answers to user queries about affected areas.

## Problem Statement Context (Geospatial AI Challenge)

The Geospatial AI Challenge highlights the transformative potential of AI in Earth science but also points out key difficulties:
1.  **Complex Data:** Earth science data is vast, heterogeneous, and often hard to process.
2.  **Data Scarcity:** Lack of standardized datasets and sufficient ground-truth/labeled data hinders model development and accuracy.
3.  **Generalization:** Models trained on limited data often fail to generalize across different regions or time periods.
4.  **Timeliness:** For applications like disaster response, insights must be timely and accurate.

The challenge asks participants to **leverage pre-trained geospatial foundation models** and **fine-tune them** for critical applications like Disaster Management, Environmental Monitoring, etc., emphasizing **data efficiency** and **generalization**.

## Our Approach & Solution

While directly implementing fine-tuning of large geospatial foundation models (like the NASA-IBM Prithvi model or models trained on HLS/Sentinel data) within a short hackathon timeframe is challenging, our approach focuses on demonstrating the *principles* outlined in the challenge using readily available tools and data:

1.  **Geospatial Data Source:** We utilize the **NASA EONET (Earth Observatory Natural Event Tracker) API** as a real-time source of global geospatial *event* data (wildfires, storms, floods, earthquakes, etc.). This serves as a proxy for the complex environmental data mentioned in the problem statement, providing location and event type information.

2.  **AI Model for Interpretation & Augmentation:** Instead of a specialized geospatial model, we leverage a **pre-trained Large Language Model (LLM - GPT-2)** via the Hugging Face `transformers` library. This aligns with the concept of using *pre-trained foundation models* to avoid training from scratch and achieve data efficiency (leveraging the LLM's vast pre-existing knowledge). The LLM is used for:
    *   **Natural Language Understanding:** Interpreting event titles to extract key information (like regions).
    *   **Information Generation:** Dynamically generating relevant emergency contact information based on the identified region.
    *   **Question Answering:** Providing context-aware answers to user queries about ongoing events.

3.  **Focus on Disaster Management:** The application is tailored to one of the key areas mentioned in the challenge – **Disaster Management and Response**. The agent specifically filters for disaster-related keywords, and the API provides relevant analysis and contact details.

4.  **Timeliness & Accessibility:**
    *   The `uagents` framework enables periodic, autonomous checking of the EONET feed for new events, ensuring timely detection.
    *   The Flask API provides an accessible interface (`/ask`, `/analysis`) for users or other systems to query information on demand. `pyngrok` makes the local service publicly accessible for demonstration.

5.  **Conceptual Alignment with Deliverables:**
    *   **AI Model:** We provide a functional system using a *pre-trained* LLM. While not fine-tuned in this iteration, it demonstrates leveraging foundation models.
    *   **Web/App Interface:** The Flask API serves as the interface for interaction.
    *   **Technical Report:** This README serves as the report, detailing the approach, insights, and alignment.
    *   **Supplementary Materials:** The codebase itself, setup instructions, and potentially a demo video.

## Features

1.  **Periodic Event Monitoring:** The Fetch.ai agent runs every 10 minutes (600 seconds) to fetch the latest events from NASA EONET.
2.  **Disaster Event Filtering:** Identifies events containing keywords like "flood", "earthquake", "wildfire", "storm", "volcano".
3.  **Dynamic Emergency Contact Generation:** Uses the LLM to determine the region of a disaster event and generate plausible emergency contact numbers (Police, Fire, Ambulance, Disaster Management) for that area.
4.  **Alerting (Optional):** If a Fetch.ai wallet address is configured, the agent sends an alert message upon detecting a critical disaster event.
5.  **On-Demand Q&A API (`/ask`):** Allows users to ask questions (e.g., "What is happening in California?"). The LLM provides an answer, using the latest event title as potential context and focusing on the country mentioned.
6.  **On-Demand Analysis API (`/analysis`):** Provides a count of recent disaster events (`anomalyCount`) and details (`disasterDetails`) including the title and generated emergency contacts for the first detected disaster.

## Technology Stack

*   **Agent Framework:** `uagents` (Fetch.ai)
*   **Web Framework:** Flask
*   **AI/ML:** `transformers` (Hugging Face), `torch` (PyTorch backend)
*   **LLM Model:** GPT-2 (default pre-trained)
*   **HTTP Requests:** `requests`
*   **Asynchronous Operations:** `nest_asyncio`
*   **Tunneling (for Development):** `pyngrok`
*   **Data Source:** NASA EONET API v3

## Setup and Running

1.  **Prerequisites:**
    *   Python 3.8+
    *   `pip` (Python package installer)
    *   An `ngrok` account and authtoken (for exposing the local server) - Get one at [ngrok.com](https://ngrok.com/)

2.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

3.  **Install Dependencies:**
    ```bash
    pip install uagents flask flask-cors requests transformers torch pyngrok nest_asyncio
    # If using CUDA (NVIDIA GPU): Ensure PyTorch with CUDA support is installed.
    # See: https://pytorch.org/get-started/locally/
    ```

4.  **Configure `ngrok`:**
    Replace `"2v3YlCufzmKaqE1WxKDPgasTZas_49JYGHphQxAo7KkXC4qRM"` in the script with your actual ngrok authtoken:
    ```python
    # Near the top of the script
    ngrok.set_auth_token("YOUR_NGROK_AUTHTOKEN")
    ```

5.  **Configure Fetch.ai Wallet (Optional):**
    Replace `"fetch1jfdeu2krsqq9zxpm36xj8pmux83h7zp9cyyqgw"` with your Fetch.ai wallet address if you want to receive agent alerts. Otherwise, leave it or set it to a placeholder like `"fetch1_"`.
    ```python
    # Near the top of the script
    MY_WALLET_ADDRESS = "YOUR_FETCH_WALLET_ADDRESS" # or "fetch1_"
    ```

6.  **Run the Script:**
    ```bash
    python your_script_name.py
    ```

7.  **Access the API:**
    *   The script will print a public `ngrok` URL (e.g., `https://<unique_id>.ngrok.io`).
    *   Use this URL to interact with the API endpoints.

## API Endpoints

1.  **`/ask` (POST)**
    *   **Description:** Ask a question about geospatial events.
    *   **Request Body (JSON):**
        ```json
        {
          "question": "What disasters are happening in Asia?"
        }
        ```
    *   **Response Body (JSON):**
        ```json
        {
          "answer": "User has not provided any country." // Or details about the mentioned country
        }
        ```

2.  **`/analysis` (POST)**
    *   **Description:** Get a summary analysis of recent disaster events.
    *   **Request Body (JSON - optional, currently unused by backend logic):**
        ```json
        {
          "city": "Tokyo",
          "latitude": 35.6895,
          "longitude": 139.6917
        }
        // Or an empty body {}
        ```
    *   **Response Body (JSON):**
        ```json
        {
          "anomalyCount": 3, // Number of disaster events found
          "disasterDetails": "Event: Wildfire near Los Angeles. Contacts: Police: 911, Fire Department: 911, Ambulance: 911, Local Disaster Management: 1800-..." // Details of the first event + contacts
        }
        // Or if no disasters found:
        {
          "anomalyCount": 0,
          "disasterDetails": ""
        }
        ```

## How it Aligns with the Geospatial AI Challenge

*   **Leveraging Pre-trained Models:** Demonstrates using a pre-trained foundation model (GPT-2 LLM) to interpret and augment data, aligning with the principle of avoiding training from scratch for efficiency.
*   **Addressing Critical Applications:** Directly targets the "Disaster Management and Response" field suggested in the challenge.
*   **Data Efficiency:** By using an LLM, the system leverages existing knowledge, conceptually mirroring the goal of data efficiency (though not in the context of scarce *labeled geospatial imagery*).
*   **Interface for Interaction:** Provides a functional API (Flask) as required.
*   **Timeliness:** The agent architecture ensures periodic checks for near real-time awareness of new events.
*   **Information Augmentation:** The dynamic generation of emergency contacts based on event location adds value beyond raw event data.

**Limitations & Differences:**
*   Uses **event data (EONET)**, not the satellite imagery (HLS, Sentinel) or SAR data mentioned in the resources.
*   Uses a **Language Model (GPT-2)**, not a specialized *Geospatial* foundation model. Fine-tuning is not implemented.
*   **Visualization** and **Benchmark Results** are not included in this implementation.
*   **Generalization** relies on the LLM's pre-trained knowledge of regions rather than geospatial model generalization across diverse imagery.

## Future Work / Potential Improvements

1.  **Integrate True Geospatial Models:** Replace or augment the LLM with actual pre-trained geospatial foundation models (like NASA/IBM's Prithvi) fine-tuned on specific tasks (e.g., flood detection, burn scar mapping) using relevant datasets (HLS, Sentinel-2, RADARSAT).
2.  **Fine-Tuning:** Implement fine-tuning pipelines for the chosen geospatial models using available labeled datasets (e.g., Sen1Floods11).
3.  **Advanced LLM Use:** Use more powerful LLMs or fine-tune smaller LLMs for better region extraction, contact generation accuracy, and Q&A relevance.
4.  **Incorporate Imagery Analysis:** Process satellite imagery corresponding to EONET event locations to provide visual evidence or detailed impact assessments.
5.  **Interactive Visualization:** Add a frontend component (e.g., using Leaflet, Mapbox GL JS) to display events on a map and visualize analysis results.
6.  **Refine Analysis:** Improve the `/analysis` endpoint to consider location inputs (city/lat/lon) and provide more sophisticated insights beyond just counting events.
7.  **Robust Error Handling:** Enhance error handling for API calls and LLM interactions.
8.  **Benchmarking:** Implement evaluation metrics to benchmark the performance of the disaster detection and information generation components.

## Disclaimer

This project uses the NASA EONET API as a proxy for real-time geospatial event data and employs a general-purpose pre-trained Language Model (GPT-2) for interpretation and information generation. This approach was chosen to demonstrate the core concepts of leveraging AI for geospatial awareness within the hackathon's scope, rather than implementing the full pipeline involving specialized geospatial foundation models and large-scale satellite data processing.