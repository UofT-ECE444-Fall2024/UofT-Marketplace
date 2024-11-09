def search_algorithm(listings, query):
    if query:
        TOTAL = 3
        lower_query = query.lower()

        def levenshtein_matching(listing):
            score = max(len(listing.title), len(query))
            search_names = listing.title.lower().split(' ')
            search_names.append(listing.title.lower())

            for name in search_names:
                score = min(score, levenshtein(lower_query, name))
                if lower_query in name:
                    score -= 3
            return score, listing

        def is_matching(levenshtein_listing):
            return levenshtein_listing[0] < TOTAL

        filtered_listings = list(filter(is_matching, map(levenshtein_matching, listings)))
        selected_listings = min_sort(filtered_listings)
        return selected_listings
    else:
        return listings


def levenshtein(query, target):
    tracker = [[-1] * (len(query) + 1) for _ in range(len(target) + 1)]

    for col in range(len(query) + 1):
        tracker[0][col] = col

    for row in range(len(target) + 1):
        tracker[row][0] = row

    for row in range(1, len(target) + 1):
        for col in range(1, len(query) + 1):
            tracker[row][col] = min(
                tracker[row][col - 1] + 1,
                tracker[row - 1][col] + 1,
                tracker[row - 1][col - 1] + (1 if query[col - 1] != target[row - 1] else 0)
            )

    return tracker[len(target)][len(query)]


def min_sort(listings):
    sorted_list = sorted(listings, key=lambda x: x[0])
    return [levenshtein_listing[1] for levenshtein_listing in sorted_list]
