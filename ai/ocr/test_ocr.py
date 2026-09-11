def test_missing_file_returns_error():
    result = extract_text(sample_path("does_not_exist.png"))
    assert result["success"] is False
    assert "error" in result


def test_unsupported_format_returns_error():
    result = extract_text(sample_path("notes.txt"))
    assert result["success"] is False
    assert "error" in result