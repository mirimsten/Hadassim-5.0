import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

def load_and_prepare_data(file_path):
    # Read the data from the CSV file
    df = pd.read_csv(file_path)

    # Safely convert 'timestamp' column to datetime format; errors will be converted to NaT
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)
    df = df.dropna(subset=['timestamp']) # a short way to remove rows with invalid 'timestamp' (NaT values)

    # Convert 'value' column to numeric, invalid entries will be converted to NaN
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    df = df.dropna(subset=['value'])

    # Remove duplicate rows based on 'timestamp' and 'value' columns
    df = df.drop_duplicates(subset=['timestamp', 'value'])

    # Add a date column to create daily blocks
    df['date'] = df['timestamp'].dt.date
    return df

# A function that accepts a set of days and returns averages by hour
def process_day_block(group):
    date, block_df = group
    block_df = block_df.copy()
    block_df['hour'] = block_df['timestamp'].dt.floor('h')

    # Calculating average values ​​per hour
    result = block_df.groupby('hour')['value'].mean().reset_index()
    result['date'] = date
    result.rename(columns={'value': 'average'}, inplace=True)
    return result

def process_all_blocks_parallel(df):
    # Division into blocks by day
    groups = list(df.groupby('date'))

    # Parallel processing
    with ThreadPoolExecutor() as executor:
        results = list(executor.map(process_day_block, groups))

    # Combining all results into one dataframe
    final_df = pd.concat(results, ignore_index=True)
    return final_df


file_path = 'time_series.csv'
df = load_and_prepare_data(file_path)

aggregated_df = process_all_blocks_parallel(df)


print("\nHourly Averages by Day:")
print(aggregated_df.head())

# Save the results to a CSV file
aggregated_df.to_csv("hourly_averages_by_day.csv", index=False)




