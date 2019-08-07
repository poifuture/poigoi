Attribute VB_Name = "Furigana"
Sub Furigana()
  Dim line As Integer
  For line = 1 To 10
    Cells(line, 1).SetPhonetic
  Next line
  For line = 1 To 10
    Dim wordstr As String
    wordstr = Cells(line, 1).Value
    Cells(line, 2).Value = wordstr
    For charid = 1 To Len(wordstr)
      Cells(line, 2 + charid).Value = Mid(wordstr, charid, 1)
    
    Next charid
  Next line
  
End Sub
