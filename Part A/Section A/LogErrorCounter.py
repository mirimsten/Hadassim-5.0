
#The code reads a large log file line by line and extracts the error code from each line.
#It collects the codes into chunks of 1000 entries and processes each chunk in parallel using multiple CPU cores. 
#For each chunk, it counts how many times each error code appears. 
#After all chunks are processed, the results are merged into a single counter that holds the total number of occurrences for each error code. 
#Finally, the code finds and prints the most frequent error codes based on the number requested.

# Time complexity:
#Reading the file and extracting error codes One pass over all lines → O(M) where M is the number of rows in the file.
#Counting frequencies (in parallel) Each line is processed once → O(M)
#Merging results We combine the counters → O(U) where U is number of different (unique) error codes.
#Getting the top N frequent codes Using a heap → O(U log N)
#Therefore, in the average case, the runtime complexity is O(M+ UlogN).

# Space complexity:
#All lines are stored temporarily in chunks Space: O(M)
#Temporary counters per chunk Each chunk produces a Counter with up to U keys Space: O(U) per chunk, but discarded after merging.
#Final combined counter Holds all unique error codes and their counts Space: O(U)
#Total Space Complexity: O(M + U)


from collections import Counter
from concurrent.futures import ProcessPoolExecutor
import os

chunk_size = 1000  

# 
def process_chunk(chunk):
    counter = Counter()
    for error_code in chunk:
        counter[error_code] += 1
    return counter

def split_and_count(file_path, N):
    total_counts = Counter()

    chunks = []
    chunk = []

    # 
    with open(file_path, 'r') as file:
        for line in file:
            error_code = line.split('Error: ')[1].strip('" \n')
            chunk.append(error_code)

            if len(chunk) >= chunk_size:
                chunks.append(chunk)
                chunk = []

        if chunk:
            chunks.append(chunk)

    # 
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as executor:
        results = executor.map(process_chunk, chunks)
        for counter in results:
            total_counts.update(counter)

    return total_counts


if __name__ == "__main__":
    file_path = 'logs.txt'
    N = 10

    total_counts = split_and_count(file_path, N)

    unique_errors = len(total_counts)

    if unique_errors < N:
        print(f"Only {unique_errors} unique error codes found in the file.")
        print("Most frequent error codes:")
        print(total_counts.most_common(unique_errors))
    else:
        print(f"Top {N} most frequent error codes:")
        print(total_counts.most_common(N))

