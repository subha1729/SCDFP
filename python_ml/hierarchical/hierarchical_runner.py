# ============================================================
# clustering_features.py
#
# INPUT:
#   sales_history_100_stores.csv
#
# OUTPUT:
#   X_refined_scaled
#
# No files are saved.
# ============================================================

import os
import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler


# ============================================================
# REQUIRED INPUT COLUMNS
# ============================================================

REQUIRED_COLUMNS = [
    "Store",
    "Date",
    "Sales",
    "Customers",
    "Promo",
    "StateHoliday",
    "SchoolHoliday",
    "StoreType",
    "Assortment",
    "CompetitionDistance",
    "CompetitionOpenSinceMonth",
    "CompetitionOpenSinceYear",
    "Promo2",
    "Promo2SinceWeek",
    "Promo2SinceYear",
    "PromoInterval"
]


# ============================================================
# FINAL CLUSTERING FEATURES
# ============================================================

CLUSTER_FEATURES = [
    "Average_Sales",
    "Average_Customers",
    "Max_Sales",
    "Max_Customers",
    "Sales_per_Customer",
    "Promotion_Frequency",
    "Open_Ratio",
    "StateHoliday_Frequency",
    "SchoolHoliday_Frequency",
    "CompetitionDistance",
    "Sales_CV",
    "Customer_CV",
    "Sales_Stability",
    "Customer_Stability"
]


# ============================================================
# LOAD CSV
# ============================================================

def load_csv(file_path):

    if not os.path.isfile(file_path):
        raise FileNotFoundError(
            f"CSV file not found:\n{file_path}"
        )

    print("=" * 70)
    print("LOADING CSV")
    print("=" * 70)

    df = pd.read_csv(
        file_path,
        low_memory=False
    )

    # Clean column names
    df.columns = (
        df.columns
        .astype(str)
        .str.strip()
    )

    # Remove accidental index columns
    df = df.loc[
        :,
        ~df.columns.str.lower().str.startswith("unnamed")
    ]

    print("Rows:", len(df))
    print("Columns:", len(df.columns))

    return df


# ============================================================
# VALIDATE COLUMNS
# ============================================================

def validate_columns(df):

    print("\n" + "=" * 70)
    print("VALIDATING COLUMNS")
    print("=" * 70)

    missing = [
        col
        for col in REQUIRED_COLUMNS
        if col not in df.columns
    ]

    if missing:

        print("\nMissing columns:")

        for col in missing:
            print(" -", col)

        raise ValueError(
            "\nYour CSV is missing required columns."
        )

    print("All required columns found.")

    return True


# ============================================================
# PREPROCESSING
# ============================================================

def preprocess_data(df):

    print("\n" + "=" * 70)
    print("PREPROCESSING")
    print("=" * 70)

    data = df.copy()

    # --------------------------------------------------------
    # Date
    # --------------------------------------------------------

    data["Date"] = pd.to_datetime(
        data["Date"],
        errors="coerce"
    )

    if data["Date"].isna().any():

        raise ValueError(
            "Invalid Date values detected."
        )

    # --------------------------------------------------------
    # Store
    # --------------------------------------------------------

    data["Store"] = pd.to_numeric(
        data["Store"],
        errors="coerce"
    )

    if data["Store"].isna().any():

        raise ValueError(
            "Invalid Store values detected."
        )

    data["Store"] = data["Store"].astype(int)

    # --------------------------------------------------------
    # Numeric columns
    # --------------------------------------------------------

    numeric_columns = [
        "Sales",
        "Customers",
        "Promo",
        "SchoolHoliday",
        "CompetitionDistance",
        "CompetitionOpenSinceMonth",
        "CompetitionOpenSinceYear",
        "Promo2",
        "Promo2SinceWeek",
        "Promo2SinceYear"
    ]

    for col in numeric_columns:

        data[col] = pd.to_numeric(
            data[col],
            errors="coerce"
        )

    # --------------------------------------------------------
    # Sales
    # --------------------------------------------------------

    data["Sales"] = (
        data["Sales"]
        .fillna(0)
        .clip(lower=0)
    )

    # --------------------------------------------------------
    # Customers
    # --------------------------------------------------------

    data["Customers"] = (
        data["Customers"]
        .fillna(0)
        .clip(lower=0)
    )

    # --------------------------------------------------------
    # Promo
    # --------------------------------------------------------

    data["Promo"] = (
        data["Promo"]
        .fillna(0)
        .clip(lower=0)
    )

    # --------------------------------------------------------
    # School Holiday
    # --------------------------------------------------------

    data["SchoolHoliday"] = (
        data["SchoolHoliday"]
        .fillna(0)
        .clip(lower=0)
    )

    # --------------------------------------------------------
    # State Holiday
    #
    # Rossmann:
    # 0 = no holiday
    # a = public holiday
    # b = Easter
    # c = Christmas
    # --------------------------------------------------------

    state = (
        data["StateHoliday"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    state_mapping = {
        "0": 0,
        "0.0": 0,
        "nan": 0,
        "none": 0,
        "": 0,
        "a": 1,
        "b": 2,
        "c": 3
    }

    mapped = state.map(
        state_mapping
    )

    numeric_state = pd.to_numeric(
        state,
        errors="coerce"
    )

    data["StateHoliday"] = (
        mapped
        .fillna(numeric_state)
        .fillna(0)
    )

    # --------------------------------------------------------
    # Competition Distance
    # --------------------------------------------------------

    median_distance = (
        data["CompetitionDistance"]
        .median()
    )

    if pd.isna(median_distance):
        median_distance = 0

    data["CompetitionDistance"] = (
        data["CompetitionDistance"]
        .fillna(median_distance)
        .clip(lower=0)
    )

    # --------------------------------------------------------
    # Other numeric fields
    # --------------------------------------------------------

    other_numeric = [
        "CompetitionOpenSinceMonth",
        "CompetitionOpenSinceYear",
        "Promo2",
        "Promo2SinceWeek",
        "Promo2SinceYear"
    ]

    for col in other_numeric:

        data[col] = (
            data[col]
            .fillna(0)
        )

    # --------------------------------------------------------
    # Open
    #
    # Your combined file doesn't contain Open.
    # Therefore observed rows are treated as open.
    # --------------------------------------------------------

    if "Open" not in data.columns:

        data["Open"] = 1

    else:

        data["Open"] = pd.to_numeric(
            data["Open"],
            errors="coerce"
        ).fillna(1)

    # --------------------------------------------------------
    # Sort
    # --------------------------------------------------------

    data = data.sort_values(
        ["Store", "Date"]
    ).reset_index(
        drop=True
    )

    print(
        "Processed rows:",
        len(data)
    )

    print(
        "Stores:",
        data["Store"].nunique()
    )

    print(
        "Date range:",
        data["Date"].min().date(),
        "→",
        data["Date"].max().date()
    )

    return data


# ============================================================
# FEATURE ENGINEERING
# ============================================================

def create_refined_features(data):

    print("\n" + "=" * 70)
    print("FEATURE ENGINEERING")
    print("=" * 70)

    # --------------------------------------------------------
    # Open / observed records
    # --------------------------------------------------------

    open_data = data[
        data["Open"] == 1
    ].copy()

    if open_data.empty:

        raise ValueError(
            "No open records available."
        )

    grouped = open_data.groupby(
        "Store"
    )

    # --------------------------------------------------------
    # Basic statistics
    # --------------------------------------------------------

    features = grouped.agg(

        Average_Sales=(
            "Sales",
            "mean"
        ),

        Average_Customers=(
            "Customers",
            "mean"
        ),

        Max_Sales=(
            "Sales",
            "max"
        ),

        Max_Customers=(
            "Customers",
            "max"
        )
    )

    # --------------------------------------------------------
    # Sales per Customer
    # --------------------------------------------------------

    features["Sales_per_Customer"] = (
        features["Average_Sales"]
        /
        features["Average_Customers"]
        .replace(0, np.nan)
    )

    # --------------------------------------------------------
    # Promotion Frequency
    # --------------------------------------------------------

    features["Promotion_Frequency"] = (
        grouped["Promo"]
        .mean()
    )

    # --------------------------------------------------------
    # Open Ratio
    # --------------------------------------------------------

    total_days = (
        data.groupby("Store")
        .size()
    )

    open_days = (
        data.groupby("Store")["Open"]
        .sum()
    )

    features["Open_Ratio"] = (
        open_days
        /
        total_days
    )

    # --------------------------------------------------------
    # State Holiday Frequency
    # --------------------------------------------------------

    features["StateHoliday_Frequency"] = (
        data.groupby("Store")[
            "StateHoliday"
        ].mean()
    )

    # --------------------------------------------------------
    # School Holiday Frequency
    # --------------------------------------------------------

    features["SchoolHoliday_Frequency"] = (
        data.groupby("Store")[
            "SchoolHoliday"
        ].mean()
    )

    # --------------------------------------------------------
    # Competition Distance
    # --------------------------------------------------------

    features["CompetitionDistance"] = (
        data.groupby("Store")[
            "CompetitionDistance"
        ].first()
    )

    # --------------------------------------------------------
    # Sales CV
    # --------------------------------------------------------

    sales_mean = (
        grouped["Sales"]
        .mean()
    )

    sales_std = (
        grouped["Sales"]
        .std()
        .fillna(0)
    )

    features["Sales_CV"] = (
        sales_std
        /
        sales_mean.replace(
            0,
            np.nan
        )
    )

    # --------------------------------------------------------
    # Customer CV
    # --------------------------------------------------------

    customer_mean = (
        grouped["Customers"]
        .mean()
    )

    customer_std = (
        grouped["Customers"]
        .std()
        .fillna(0)
    )

    features["Customer_CV"] = (
        customer_std
        /
        customer_mean.replace(
            0,
            np.nan
        )
    )

    # --------------------------------------------------------
    # Stability
    # --------------------------------------------------------

    features["Sales_Stability"] = (
        1
        /
        (
            1
            +
            features["Sales_CV"]
        )
    )

    features["Customer_Stability"] = (
        1
        /
        (
            1
            +
            features["Customer_CV"]
        )
    )

    # --------------------------------------------------------
    # Reset index
    # --------------------------------------------------------

    features = (
        features
        .reset_index()
    )

    # --------------------------------------------------------
    # Exact feature order
    # --------------------------------------------------------

    features = features[
        ["Store"] + CLUSTER_FEATURES
    ]

    print(
        "Refined features:",
        features.shape
    )

    return features


# ============================================================
# CLEAN FEATURES
# ============================================================

def clean_refined_features(features):

    print("\n" + "=" * 70)
    print("CLEANING REFINED FEATURES")
    print("=" * 70)

    cleaned = features.copy()

    X = cleaned[
        CLUSTER_FEATURES
    ].copy()

    # --------------------------------------------------------
    # Numeric conversion
    # --------------------------------------------------------

    X = X.apply(
        pd.to_numeric,
        errors="coerce"
    )

    # --------------------------------------------------------
    # Infinity
    # --------------------------------------------------------

    X = X.replace(
        [np.inf, -np.inf],
        np.nan
    )

    # --------------------------------------------------------
    # Median imputation
    # --------------------------------------------------------

    for col in X.columns:

        median = X[col].median()

        if pd.isna(median):
            median = 0

        X[col] = (
            X[col]
            .fillna(median)
        )

    # --------------------------------------------------------
    # Final NaN protection
    # --------------------------------------------------------

    X = X.fillna(0)

    # --------------------------------------------------------
    # Validation
    # --------------------------------------------------------

    if X.isna().any().any():

        raise ValueError(
            "NaN values remain in X_refined."
        )

    if np.isinf(
        X.to_numpy()
    ).any():

        raise ValueError(
            "Infinite values remain in X_refined."
        )

    cleaned = pd.concat(
        [
            cleaned[
                ["Store"]
            ].reset_index(drop=True),

            X.reset_index(drop=True)
        ],
        axis=1
    )

    print(
        "Cleaned features:",
        X.shape
    )

    return cleaned


# ============================================================
# SCALE
# ============================================================

def scale_refined_features(
    refined_features
):

    print("\n" + "=" * 70)
    print("STANDARD SCALING")
    print("=" * 70)

    # --------------------------------------------------------
    # Extract ONLY clustering features
    # --------------------------------------------------------

    X_refined = (
        refined_features[
            CLUSTER_FEATURES
        ]
        .copy()
    )

    # --------------------------------------------------------
    # StandardScaler
    # --------------------------------------------------------

    scaler = StandardScaler()

    scaled_array = (
        scaler.fit_transform(
            X_refined
        )
    )

    # --------------------------------------------------------
    # IMPORTANT:
    # Convert back to DataFrame
    # --------------------------------------------------------

    X_refined_scaled = pd.DataFrame(
        scaled_array,
        columns=CLUSTER_FEATURES,
        index=refined_features.index
    )

    # --------------------------------------------------------
    # Validation
    # --------------------------------------------------------

    if X_refined_scaled.isna().any().any():

        raise ValueError(
            "X_refined_scaled contains NaN."
        )

    if np.isinf(
        X_refined_scaled.to_numpy()
    ).any():

        raise ValueError(
            "X_refined_scaled contains Inf."
        )

    print(
        "Type:",
        type(X_refined_scaled)
    )

    print(
        "Shape:",
        X_refined_scaled.shape
    )

    return X_refined_scaled


# ============================================================
# COMPLETE PIPELINE
# ============================================================

def prepare_clustering_data(
    file_path
):

    print("\n")
    print("=" * 70)
    print("SALES HISTORY → X_REFINED_SCALED")
    print("=" * 70)

    # 1. Load
    df = load_csv(
        file_path
    )

    # 2. Validate
    validate_columns(
        df
    )

    # 3. Preprocess
    processed = preprocess_data(
        df
    )

    # 4. Feature engineering
    refined_features = (
        create_refined_features(
            processed
        )
    )

    # 5. Cleaning
    refined_features = (
        clean_refined_features(
            refined_features
        )
    )

    # 6. Scaling
    X_refined_scaled = (
        scale_refined_features(
            refined_features
        )
    )

    # --------------------------------------------------------
    # FINAL OUTPUT ONLY
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("PIPELINE COMPLETE")
    print("=" * 70)

    print(
        "Number of stores:",
        len(X_refined_scaled)
    )

    print(
        "Number of features:",
        len(X_refined_scaled.columns)
    )

    print(
        "Final shape:",
        X_refined_scaled.shape
    )

    print(
        "Final type:",
        type(X_refined_scaled)
    )

    print("\nFeatures:")

    print(
        list(X_refined_scaled.columns)
    )

    return X_refined_scaled



# ============================================================
# 1. IMPORTS
# ============================================================

import os
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.decomposition import PCA
from scipy.cluster.hierarchy import linkage


# ============================================================
# 2. FILE PATHS
# ============================================================

SALES_HISTORY_PATH = rclear
"D:\Development\Demand Forecasting Platform\New folder\server\uploads\sales_history_dummy_new.csv"
MODEL_PATH = r"D:\Development\Demand Forecasting Platform\New folder\python_ml\hierarchical\hierarchical_model.pkl"

print("=" * 70)
print("LOADING SALES HISTORY")
print("=" * 70)

history = pd.read_csv(SALES_HISTORY_PATH)

print("Sales history shape:", history.shape)
print("Columns:", list(history.columns))


# ============================================================
# 5. LOAD HIERARCHICAL MODEL
# ============================================================

print("\n" + "=" * 70)
print("LOADING HIERARCHICAL MODEL")
print("=" * 70)

model = joblib.load(MODEL_PATH)

print("Model loaded successfully")
print("Model type:", type(model))
print("Number of clusters:", model.n_clusters)
print("Linkage:", model.linkage)


# ============================================================
# HIERARCHICAL CLUSTERING - OUTPUT MODULE
# ============================================================
# INPUTS ALREADY CREATED BY YOUR PREPROCESSING:
#
#   X_refined
#   X_refined_scaled
#   store_ids
#   model
#
# This file ONLY:
#   1. Generates cluster labels
#   2. Creates Store -> Cluster output
#   3. Creates cluster summary
#   4. Creates scatter-plot data
#   5. Creates dendrogram data
#   6. Saves CSV + JSON
#
# NO preprocessing
# NO validation
# NO scaling
# NO feature engineering
# NO CSV loading
# ============================================================

import os
import json
import numpy as np
import pandas as pd
import shutil


from scipy.cluster.hierarchy import linkage
from sklearn.decomposition import PCA


# ============================================================
# 1. OUTPUT DIRECTORY
# ============================================================


OUTPUT_DIR = r"D:\Development\Demand Forecasting Platform\New folder\model_outputs\hierarchical"


# Remove previous output folder
if os.path.exists(OUTPUT_DIR):
    shutil.rmtree(OUTPUT_DIR)

# Create fresh output folder
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Previous output files removed.")
print("Fresh output directory created:", OUTPUT_DIR)

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)




# ============================================================
# 2. GENERATE CLUSTER LABELS
# ============================================================

print("=" * 70)
print("HIERARCHICAL CLUSTERING")
print("=" * 70)

X_refined_scaled = prepare_clustering_data(SALES_HISTORY_PATH)
store_ids = prepare_clustering_data(SALES_HISTORY_PATH).index

labels = model.fit_predict(
    X_refined_scaled
)

print("Clustering completed.")
print("Number of stores:", len(store_ids))
print("Number of clusters:", len(np.unique(labels)))


# ============================================================
# 3. STORE -> CLUSTER
# ============================================================

store_clusters = pd.DataFrame({
    "Store": store_ids,
    "Cluster": labels.astype(int)
})

store_clusters = (
    store_clusters
    .sort_values("Store")
    .reset_index(drop=True)
)

print("\n" + "=" * 70)
print("STORE -> CLUSTER")
print("=" * 70)

print(
    store_clusters.to_string(index=False)
)


# ============================================================
# 4. CLUSTER SUMMARY
# ============================================================

cluster_summary = (
    store_clusters
    .groupby("Cluster")
    .agg(
        StoreCount=("Store", "count"),
        Stores=("Store", list)
    )
    .reset_index()
)

print("\n" + "=" * 70)
print("CLUSTER SUMMARY")
print("=" * 70)

print(
    cluster_summary.to_string(index=False)
)


# ============================================================
# 5. SCATTER PLOT DATA
#
# PCA converts the existing 14-dimensional
# X_refined_scaled into 2 dimensions ONLY for visualization.
#
# It does NOT affect clustering.
# ============================================================

pca = PCA(
    n_components=2,
    random_state=42
)

pca_values = pca.fit_transform(
    X_refined_scaled
)

scatter_data = pd.DataFrame({
    "Store": store_ids,
    "X": pca_values[:, 0],
    "Y": pca_values[:, 1],
    "Cluster": labels.astype(int)
})

print("\n" + "=" * 70)
print("SCATTER PLOT DATA CREATED")
print("=" * 70)

print(
    scatter_data.head().to_string(index=False)
)


# ============================================================
# 6. DENDROGRAM DATA
#
# Uses the SAME X_refined_scaled that was given to clustering.
#
# This is only for visualization.
# ============================================================

linkage_method = getattr(
    model,
    "linkage",
    "ward"
)

Z = linkage(
    X_refined_scaled,
    method=linkage_method
)

print("\n" + "=" * 70)
print("DENDROGRAM DATA CREATED")
print("=" * 70)

print("Linkage method:", linkage_method)
print("Linkage matrix shape:", Z.shape)


# ============================================================
# 7. SAVE STORE -> CLUSTER CSV
# ============================================================

store_cluster_path = os.path.join(
    OUTPUT_DIR,
    "hierarchical_store_clusters.csv"
)

store_clusters.to_csv(
    store_cluster_path,
    index=False
)


# ============================================================
# 8. SAVE CLUSTER SUMMARY CSV
# ============================================================

summary_path = os.path.join(
    OUTPUT_DIR,
    "hierarchical_cluster_summary.csv"
)

# Convert list of stores into a readable string for CSV
summary_csv = cluster_summary.copy()

summary_csv["Stores"] = (
    summary_csv["Stores"]
    .apply(
        lambda x: ",".join(
            str(int(store))
            for store in x
        )
    )
)

summary_csv.to_csv(
    summary_path,
    index=False
)


# ============================================================
# 9. SAVE SCATTER DATA CSV
# ============================================================

scatter_path = os.path.join(
    OUTPUT_DIR,
    "hierarchical_scatter_data.csv"
)

scatter_data.to_csv(
    scatter_path,
    index=False
)


# ============================================================
# 10. PREPARE DENDROGRAM JSON
# ============================================================

dendrogram_data = {
    "linkage_method": linkage_method,

    "labels": [
        int(store)
        for store in store_ids
    ],

    "linkage_matrix": Z.tolist()
}


# ============================================================
# 11. SAVE DENDROGRAM JSON
# ============================================================

dendrogram_path = os.path.join(
    OUTPUT_DIR,
    "hierarchical_dendrogram.json"
)

with open(
    dendrogram_path,
    "w"
) as f:

    json.dump(
        dendrogram_data,
        f,
        indent=2
    )


# ============================================================
# 12. CREATE FINAL JSON
# ============================================================

final_output = {

    "status": "success",

    "model": {
        "name": "Hierarchical Clustering",

        "number_of_clusters":
            int(len(np.unique(labels))),

        "linkage":
            linkage_method
    },

    "store_assignments": [
        {
            "store":
                int(row["Store"]),

            "cluster":
                int(row["Cluster"])
        }

        for _, row in store_clusters.iterrows()
    ],

    "cluster_summary": [
        {
            "cluster":
                int(row["Cluster"]),

            "store_count":
                int(row["StoreCount"]),

            "stores": [
                int(store)
                for store in row["Stores"]
            ]
        }

        for _, row in cluster_summary.iterrows()
    ],

    "scatter_data": [
        {
            "store":
                int(row["Store"]),

            "x":
                float(row["X"]),

            "y":
                float(row["Y"]),

            "cluster":
                int(row["Cluster"])
        }

        for _, row in scatter_data.iterrows()
    ],

    "dendrogram": dendrogram_data
}


# ============================================================
# 13. SAVE FINAL JSON
# ============================================================

json_path = os.path.join(
    OUTPUT_DIR,
    "hierarchical_clustering_result.json"
)

with open(
    json_path,
    "w"
) as f:

    json.dump(
        final_output,
        f,
        indent=2
    )


# ============================================================
# 14. FINAL OUTPUT
# ============================================================

print("\n" + "=" * 70)
print("HIERARCHICAL CLUSTERING OUTPUT COMPLETE")
print("=" * 70)

print(
    f"Stores processed : {len(store_ids)}"
)

print(
    f"Clusters found   : {len(np.unique(labels))}"
)

print("\nGenerated files:")

print(
    f"1. {store_cluster_path}"
)

print(
    f"2. {summary_path}"
)

print(
    f"3. {scatter_path}"
)

print(
    f"4. {dendrogram_path}"
)

print(
    f"5. {json_path}"
)

print("\n" + "=" * 70)
print("STORE -> CLUSTER")
print("=" * 70)

print(
    store_clusters.to_string(index=False)
)