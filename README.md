# SEANFD – Southeast Asia Network & Factor Dynamics

SEANFD is an **interactive dashboard** that models how **information, news, and trends flow across Southeast Asia**, with **Cambodia as the central node**. By combining real-world data with network analysis, the platform allows users to explore:

- Which countries influence Cambodia the most  
- The speed of information spread  
- The paths that information takes across the region  

---

## Project Overview

SEANFD builds an **interactive visualization dashboard** for Southeast Asia, highlighting **information flow networks**. Using Cambodia as the central node, the dashboard shows:

- Which neighboring countries influence Cambodia the most  
- How fast trends, news, or information travel  
- The paths information takes across the network  

---

## Purpose

- Visualize and measure **information flow** between Cambodia and its neighbors  
- Identify the **strongest influencers** and **fastest information routes**  
- Simulate and **predict the spread** of news or trends in real-time  

---

## Factors

The network graph uses multiple weighted factors to determine the **strength and speed of information flow**:

| Factor        | What it measures                                  | Example                                                   |
| ------------- | ------------------------------------------------ | --------------------------------------------------------- |
| Social Media  | Activity level on social media; likelihood to spread news | Thailand has many users → higher weight to neighbors     |
| Internet      | Internet penetration and connectivity           | Better connectivity → faster information flow           |
| Tourism       | Volume of people traveling between countries    | More tourists → higher chance of trend/news spreading   |
| Trade         | Trade relations → economic influence            | High trade → stronger communication and influence       |
| Historical    | Cultural or historical ties                     | Shared language, past events, diaspora connections      | 

---

## Installation

1. **Clone the repository**  

```bash
git clone https://github.com/your-username/SEANFD.git
cd SEANFD
