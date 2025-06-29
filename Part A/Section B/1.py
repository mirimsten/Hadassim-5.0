import pandas as pd

def load_and_validate_data(file_path):
    # Read the data from the CSV file
    df = pd.read_csv(file_path)

    # Safely convert 'timestamp' column to datetime format; errors will be converted to NaT
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)




    # Identify and remove rows with invalid 'timestamp' (NaT values)
    invalid_date_rows = df['timestamp'].isna()
    if invalid_date_rows.any():
        print(f"Removed {invalid_date_rows.sum()} rows with invalid date format.")
        df = df[~invalid_date_rows]

    # Convert 'value' column to numeric, invalid entries will be converted to NaN
    df['value'] = pd.to_numeric(df['value'], errors='coerce')

    # Identify and remove rows with non-numeric 'value' entries (NaN values)
    non_numeric_rows = df['value'].isna()
    if non_numeric_rows.any():
        print(f"Removed {non_numeric_rows.sum()} rows with non-numeric values.")
        df = df[~non_numeric_rows]

    # Remove duplicate rows based on 'timestamp' and 'value' columns
    before_duplicates = len(df)
    df = df.drop_duplicates(subset=['timestamp', 'value'])
    removed_duplicates = before_duplicates - len(df)
    if removed_duplicates > 0:
        print(f"Removed {removed_duplicates} duplicate rows.")

    # Return the cleaned dataframe, resetting index
    return df.reset_index(drop=True)

# Load the data and apply validation checks
file_path = 'time_series.csv'
df = load_and_validate_data(file_path)

# If the data is valid, print success message
if df is not None:
    print("Data loaded, cleaned, and validated successfully.")
else:
    print("Data validation failed.")

# Function to calculate hourly average
def calculate_hourly_average(df):
    # Ensure 'timestamp' column is in datetime format
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Round 'timestamp' to the nearest hour (flooring the timestamp)
    df['hour'] = df['timestamp'].dt.floor('h')

    # Calculate the average 'value' for each hour
    hourly_avg = df.groupby('hour')['value'].mean().reset_index()

    # Display the hourly average
    print(hourly_avg)
    return hourly_avg

# Calculate hourly average if data is valid
if df is not None:
    hourly_avg = calculate_hourly_average(df)