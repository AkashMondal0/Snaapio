function searchText(textToSearch?: string, searchTerm?: string) {
    if (!searchTerm || !textToSearch) return true
    // Escape special characters in search term to safely use in regex
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create a case-insensitive regular expression
    const regex = new RegExp(escapedTerm, 'i');

    // Filter the data based on the regex match
    return regex.test(textToSearch);
}
// searchText('searchTerm')

export default searchText;