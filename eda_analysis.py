#!/usr/bin/env python3
"""
Performs rigorous Exploratory Data Analysis (EDA) on dataset.csv for SkyShield Bharat.
Generates 4 publication-quality visualization charts in eda_plots/:
1. plot1_temporal_incident_trends_and_airline_distribution.png
2. plot2_flight_phase_vs_altitude_airspeed_envelope.png
3. plot3_icao_5x5_risk_matrix_heatmap.png
4. plot4_hfacs_human_factors_and_capa_status.png
Also combines them into eda_visualisations.png.
"""

import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set publication style
plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8

def run_eda():
    os.makedirs('eda_plots', exist_ok=True)
    df = pd.read_csv('dataset.csv')
    df['reported_at'] = pd.to_datetime(df['reported_at'])
    df['year_month'] = df['reported_at'].dt.to_period('M')

    print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns.")

    # -------------------------------------------------------------
    # Plot 1: Temporal Trends & Airline Volume
    # -------------------------------------------------------------
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5.5), dpi=300)
    
    # 1A: Monthly Trend
    monthly_counts = df.groupby('year_month').size()
    ax1.plot(monthly_counts.index.astype(str), monthly_counts.values, marker='o', color='#2563eb', linewidth=2, markersize=5)
    ax1.fill_between(monthly_counts.index.astype(str), monthly_counts.values, color='#93c5fd', alpha=0.35)
    ax1.set_title("Monthly Aviation Occurrence Ingestion (2024–2026)", fontsize=11, fontweight='bold', color='#0f172a', pad=10)
    ax1.set_xlabel("Observation Month", fontsize=9.5, color='#334155')
    ax1.set_ylabel("Reported Incidents Count", fontsize=9.5, color='#334155')
    ax1.tick_params(axis='x', rotation=60, labelsize=7.5)
    ax1.tick_params(axis='y', labelsize=8.5)
    ax1.grid(True, linestyle='--', alpha=0.5)

    # 1B: Airline Distribution
    airline_counts = df['airline'].value_counts()
    colors = ['#3b82f6', '#0ea5e9', '#06b6d4', '#6366f1', '#8b5cf6', '#a855f7']
    bars = ax2.bar(airline_counts.index, airline_counts.values, color=colors, edgecolor='#1e293b', linewidth=0.8, width=0.6)
    ax2.set_title("Incident Volume Breakdown by Indian Scheduled Carrier", fontsize=11, fontweight='bold', color='#0f172a', pad=10)
    ax2.set_xlabel("Airline Operator", fontsize=9.5, color='#334155')
    ax2.set_ylabel("Occurrence Volume", fontsize=9.5, color='#334155')
    ax2.tick_params(axis='x', rotation=25, labelsize=8.5)
    ax2.tick_params(axis='y', labelsize=8.5)
    for bar in bars:
        h = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., h + 20, f'{h:,}', ha='center', va='bottom', fontsize=8.5, fontweight='bold', color='#0f172a')
    ax2.grid(True, linestyle='--', alpha=0.5)

    plt.tight_layout()
    plt.savefig('eda_plots/plot1_temporal_incident_trends_and_airline_distribution.png', dpi=300)
    plt.close()

    # -------------------------------------------------------------
    # Plot 2: Flight Phase vs Altitude & Airspeed Envelope
    # -------------------------------------------------------------
    fig, ax = plt.subplots(figsize=(11, 6), dpi=300)
    
    phases = df['flight_phase'].unique()
    palette = sns.color_palette("tab10", len(phases))
    
    for phase, color in zip(phases, palette):
        sub = df[df['flight_phase'] == phase]
        ax.scatter(sub['airspeed_kts'], sub['altitude_ft'], label=phase, alpha=0.6, s=18, edgecolors='none', color=color)

    # Highlight High Energy / Anomalies
    anomalies = df[df['peak_g_force'] > 2.2]
    ax.scatter(anomalies['airspeed_kts'], anomalies['altitude_ft'], color='#ef4444', s=45, marker='x', label=f'G-Force Exceedance (>2.2G, n={len(anomalies)})', zorder=5)

    ax.set_title("Aerodynamic Flight Envelope: Calibrated Airspeed vs Altitude by Flight Phase", fontsize=12, fontweight='bold', color='#0f172a', pad=12)
    ax.set_xlabel("Calibrated Airspeed (Knots / CAS)", fontsize=10, color='#334155')
    ax.set_ylabel("Indicated Altitude (Feet MSL)", fontsize=10, color='#334155')
    ax.legend(loc='upper left', frameon=True, facecolor='#ffffff', edgecolor='#cbd5e1', fontsize=8.5)
    ax.set_xlim(-10, 520)
    ax.set_ylim(-1000, 43000)
    ax.grid(True, linestyle='--', alpha=0.5)

    plt.tight_layout()
    plt.savefig('eda_plots/plot2_flight_phase_vs_altitude_airspeed_envelope.png', dpi=300)
    plt.close()

    # -------------------------------------------------------------
    # Plot 3: ICAO 5x5 Risk Matrix Heatmap
    # -------------------------------------------------------------
    fig, ax = plt.subplots(figsize=(9, 6.5), dpi=300)
    
    likelihood_order = ['E', 'D', 'C', 'B', 'A']
    severity_order = [1, 2, 3, 4, 5]
    
    matrix_counts = pd.crosstab(df['likelihood'], df['severity']).reindex(index=likelihood_order, columns=severity_order, fill_value=0)
    
    # Annotate with percentages
    total_incidents = len(df)
    annot_matrix = matrix_counts.map(lambda v: f"{v}\n({v/total_incidents*100:.1f}%)")
    
    sns.heatmap(matrix_counts, annot=annot_matrix, fmt="", cmap="YlOrRd", cbar_kws={'label': 'Incident Count'}, ax=ax, linewidths=1.2, linecolor='#f8fafc')
    
    ax.set_title("ICAO Annex 19 5x5 Safety Risk Matrix Distribution", fontsize=12, fontweight='bold', color='#0f172a', pad=12)
    ax.set_xlabel("Severity Index (1: Negligible ➔ 5: Catastrophic)", fontsize=10, color='#334155')
    ax.set_ylabel("Likelihood Level (A: Improbable ➔ E: Frequent)", fontsize=10, color='#334155')
    ax.set_xticklabels(['1: Negligible', '2: Minor', '3: Major', '4: Hazardous', '5: Catastrophic'], rotation=15, fontsize=8.5)
    ax.set_yticklabels(['E: Frequent', 'D: Occasional', 'C: Remote', 'B: Improbable', 'A: Extremely Improbable'], rotation=0, fontsize=8.5)

    plt.tight_layout()
    plt.savefig('eda_plots/plot3_icao_5x5_risk_matrix_heatmap.png', dpi=300)
    plt.close()

    # -------------------------------------------------------------
    # Plot 4: HFACS Human Factors & CAPA Resolution Status
    # -------------------------------------------------------------
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5.5), dpi=300)
    
    # 4A: HFACS Tier
    hfacs_counts = df['hfacs_tier'].value_counts()
    tier_colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444']
    ax1.pie(hfacs_counts.values, labels=[lbl.replace(': ', '\n') for lbl in hfacs_counts.index], autopct='%1.1f%%',
            startangle=140, colors=tier_colors, textprops={'fontsize': 8.5, 'color': '#0f172a', 'weight': 'bold'},
            wedgeprops={'edgecolor': '#ffffff', 'linewidth': 1.5})
    ax1.set_title("Human Factors (HFACS) Causal Breakdown", fontsize=11, fontweight='bold', color='#0f172a', pad=10)

    # 4B: CAPA & Investigation Status
    status_counts = df['status'].value_counts()
    status_colors = ['#10b981', '#f59e0b', '#3b82f6']
    bars = ax2.bar(status_counts.index, status_counts.values, color=status_colors, edgecolor='#1e293b', linewidth=0.8, width=0.55)
    ax2.set_title("DGCA CAR Investigation & CAPA Workflow Status", fontsize=11, fontweight='bold', color='#0f172a', pad=10)
    ax2.set_xlabel("Regulatory Resolution State", fontsize=9.5, color='#334155')
    ax2.set_ylabel("Number of Occurrences", fontsize=9.5, color='#334155')
    ax2.tick_params(axis='x', rotation=15, labelsize=8.5)
    ax2.tick_params(axis='y', labelsize=8.5)
    for bar in bars:
        h = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., h + 25, f'{h:,}\n({h/len(df)*100:.1f}%)', ha='center', va='bottom', fontsize=8.5, fontweight='bold', color='#0f172a')
    ax2.grid(True, linestyle='--', alpha=0.5)

    plt.tight_layout()
    plt.savefig('eda_plots/plot4_hfacs_human_factors_and_capa_status.png', dpi=300)
    plt.close()

    # -------------------------------------------------------------
    # Combine into unified eda_visualisations.png
    # -------------------------------------------------------------
    fig, axes = plt.subplots(2, 2, figsize=(18, 14), dpi=250)
    fig.patch.set_facecolor('#f8fafc')

    # Load previously saved images
    img1 = plt.imread('eda_plots/plot1_temporal_incident_trends_and_airline_distribution.png')
    img2 = plt.imread('eda_plots/plot2_flight_phase_vs_altitude_airspeed_envelope.png')
    img3 = plt.imread('eda_plots/plot3_icao_5x5_risk_matrix_heatmap.png')
    img4 = plt.imread('eda_plots/plot4_hfacs_human_factors_and_capa_status.png')

    axes[0, 0].imshow(img1)
    axes[0, 0].axis('off')
    axes[0, 0].set_title("(A) Temporal Volume & Fleet Distribution", fontsize=12, fontweight='bold', color='#0f172a')

    axes[0, 1].imshow(img2)
    axes[0, 1].axis('off')
    axes[0, 1].set_title("(B) Aerodynamic Safety Envelope Analysis", fontsize=12, fontweight='bold', color='#0f172a')

    axes[1, 0].imshow(img3)
    axes[1, 0].axis('off')
    axes[1, 0].set_title("(C) ICAO 5x5 Severity/Likelihood Heatmap", fontsize=12, fontweight='bold', color='#0f172a')

    axes[1, 1].imshow(img4)
    axes[1, 1].axis('off')
    axes[1, 1].set_title("(D) HFACS Root-Cause & CAPA Compliance", fontsize=12, fontweight='bold', color='#0f172a')

    plt.suptitle("SkyShield Bharat — National Aviation Safety Exploratory Data Analysis (5,000 Incidents)", fontsize=16, fontweight='bold', color='#0f172a', y=0.98)
    plt.tight_layout()
    plt.savefig('eda_visualisations.png', dpi=250, bbox_inches='tight')
    plt.close()

    print("All EDA charts generated successfully in eda_plots/ and eda_visualisations.png!")

if __name__ == '__main__':
    run_eda()
