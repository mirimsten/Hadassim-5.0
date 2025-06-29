import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

def load_and_prepare_data(file_path):
    # Read the data from the PARQUET file
    df = pd.read_parquet(file_path) 
    df.rename(columns={'mean_value': 'value'}, inplace=True) 

    # Safely convert 'timestamp' column to datetime format; errors will be converted to NaT
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)
    df = df.dropna(subset=['timestamp'])

    # Convert 'value' column to numeric, invalid entries will be converted to NaN
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    df = df.dropna(subset=['value'])

    # Remove duplicate rows based on 'timestamp' and 'value' columns
    df = df.drop_duplicates(subset=['timestamp', 'value'])

    # Add a date column to create daily blocks
    df['date'] = df['timestamp'].dt.date
    return df

def process_day_block(group):
    date, block_df = group
    block_df = block_df.copy()
    block_df['hour'] = block_df['timestamp'].dt.floor('h')

    result = block_df.groupby('hour')['value'].mean().reset_index()
    result['date'] = date
    result.rename(columns={'value': 'average'}, inplace=True)
    return result

def process_all_blocks_parallel(df):
    groups = list(df.groupby('date'))
    with ThreadPoolExecutor() as executor:
        results = list(executor.map(process_day_block, groups))
    final_df = pd.concat(results, ignore_index=True)
    return final_df


file_path = 'time_series.parquet'
df = load_and_prepare_data(file_path)

aggregated_df = process_all_blocks_parallel(df)

print("\nHourly Averages by Day:")
print(aggregated_df.head())

aggregated_df.to_csv("hourly_averages_by_day.csv", index=False)


# ---------- Advantages of Using Parquet Format ----------
# 1. Efficient Storage: Parquet is a columnar storage format, which saves storage space by compressing data.
# 2. Faster Read/Write Operations: Only necessary columns are read/written, improving performance for large datasets.
# 3. Supports Nested Data: Parquet can store complex nested data structures, unlike row-based formats.
# 4. Optimized for Big Data: Ideal for distributed processing with engines like Apache Spark and Apache Hive.
# 5. Schema Evolution: Parquet supports schema changes without breaking data structures.
# 6. Cross-Platform Compatibility: Parquet is supported by various tools and systems, enhancing interoperability.
