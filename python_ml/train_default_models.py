"""
=============================================================================
TRAIN & EXPORT DEFAULT PRE-TRAINED ML MODELS
=============================================================================
This script trains baseline pre-trained models and saves them to:
  - python_ml/saved_models/forecast_model.joblib
  - python_ml/saved_models/hierarchical_cluster.joblib

Run: python train_default_models.py
"""

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import linkage

# Ensure saved_models folder exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'saved_models')
os.makedirs(MODELS_DIR, exist_ok=True)

def train_and_save_forecast_model():
    print("[1/2] Training baseline Demand Forecasting Model (GradientBoosting)...")
    np.random.seed(42)
    
    # Synthetic historical features: [day_of_week, promo_flag, holiday_flag, lag_1_sales, lag_7_sales, price]
    n_samples = 1500
    day_of_week = np.random.randint(0, 7, n_samples)
    promo_flag = np.random.binomial(1, 0.25, n_samples)
    holiday_flag = np.random.binomial(1, 0.08, n_samples)
    price = np.random.uniform(2.5, 45.0, n_samples)
    lag_1_sales = np.random.uniform(50, 450, n_samples)
    lag_7_sales = np.random.uniform(50, 480, n_samples)
    
    # Target demand with realistic multiplier effects
    y = (
        lag_1_sales * 0.45 +
        lag_7_sales * 0.35 +
        (promo_flag * 120.0) +
        (holiday_flag * 85.0) +
        (np.sin(day_of_week / 7.0 * np.pi) * 35.0) -
        (price * 1.8) +
        np.random.normal(0, 15, n_samples)
    )
    y = np.clip(y, 10, None)
    
    X = np.column_stack([day_of_week, promo_flag, holiday_flag, lag_1_sales, lag_7_sales, price])
    
    model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42)
    model.fit(X, y)
    
    model_path = os.path.join(MODELS_DIR, 'forecast_model.joblib')
    joblib.dump(model, model_path)
    print(f"  [OK] Saved Pretrained Forecast Model -> {model_path}")

def train_and_save_hierarchical_clustering_model():
    print("[2/2] Training baseline Hierarchical (Agglomerative) Clustering Model...")
    np.random.seed(42)
    
    # 145 stores with features: [Sales Velocity (0-100), Price Elasticity (0-2.2)]
    # Cluster A: Metros (High Velocity 75-98, Low Elasticity 0.3-0.6)
    n_a = 52
    vel_a = np.random.uniform(75, 98, n_a)
    ela_a = np.random.uniform(0.32, 0.58, n_a)
    
    # Cluster B: Suburban (Medium Velocity 45-68, High Elasticity 1.6-2.1)
    n_b = 48
    vel_b = np.random.uniform(44, 68, n_b)
    ela_b = np.random.uniform(1.65, 2.05, n_b)
    
    # Cluster C: Seasonal (Low/Med Velocity 22-45, Med Elasticity 1.05-1.40)
    n_c = 45
    vel_c = np.random.uniform(22, 45, n_c)
    ela_c = np.random.uniform(1.05, 1.42, n_c)
    
    X_stores = np.vstack([
        np.column_stack([vel_a, ela_a]),
        np.column_stack([vel_b, ela_b]),
        np.column_stack([vel_c, ela_c])
    ])
    
    # Agglomerative Hierarchical Clustering (3 clusters, Ward linkage)
    hierarchical_model = AgglomerativeClustering(n_clusters=3, metric='euclidean', linkage='ward')
    hierarchical_model.fit(X_stores)
    
    # Compute hierarchical linkage matrix for dendrogram tree
    Z = linkage(X_stores, method='ward', metric='euclidean')
    
    clustering_bundle = {
        'model': hierarchical_model,
        'linkage_matrix': Z,
        'feature_names': ['sales_velocity', 'price_elasticity'],
        'cluster_labels': {0: 'Cluster A · High Performing', 1: 'Cluster B · Promo Sensitive', 2: 'Cluster C · Seasonal'}
    }
    
    model_path = os.path.join(MODELS_DIR, 'hierarchical_cluster.joblib')
    joblib.dump(clustering_bundle, model_path)
    print(f"  [OK] Saved Pretrained Hierarchical Clustering Model -> {model_path}")

def generate_sample_sales_csv():
    csv_path = os.path.join(BASE_DIR, 'sample_sales_history.csv')
    dates = pd.date_range(end=pd.Timestamp.today(), periods=30, freq='D')
    stores = ['STR-101', 'STR-102', 'STR-103', 'STR-104', 'STR-105']
    skus = ['SKU-8821', 'SKU-9943', 'SKU-7732', 'SKU-4412']
    
    records = []
    for d in dates:
        for s in stores:
            for k in skus:
                promo = 1 if np.random.rand() > 0.75 else 0
                holiday = 1 if d.weekday() >= 5 else 0
                units = int(np.random.uniform(40, 220) + (promo * 60))
                revenue = round(units * np.random.uniform(3.5, 24.0), 2)
                records.append({
                    'Date': d.strftime('%Y-%m-%d'),
                    'Store_ID': s,
                    'SKU_ID': k,
                    'Sales_Units': units,
                    'Revenue': revenue,
                    'Promo_Flag': promo,
                    'Holiday_Flag': holiday
                })
    
    df = pd.DataFrame(records)
    df.to_csv(csv_path, index=False)
    print(f"  [OK] Created Sample History Dataset -> {csv_path} ({len(df)} rows)")

if __name__ == '__main__':
    train_and_save_forecast_model()
    train_and_save_hierarchical_clustering_model()
    generate_sample_sales_csv()
    print("\n[SUCCESS] Pre-trained models and sample history dataset ready!")
