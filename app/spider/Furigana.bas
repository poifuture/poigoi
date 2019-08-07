Attribute VB_Name = "Furigana"
Function IsHiragana(ch As String) As Boolean
  Dim code As Integer
  code = AscW(ch)
  IsHiragana = code >= CLng("&H3041") And code <= CLng("&H3096")
End Function
Function IsKatakana(ch As String) As Boolean
  Dim code As Integer
  code = AscW(ch)
  IsKatakana = code >= CLng("&H30A1") And code <= CLng("&H30FE")
End Function

Sub Test()
MsgBox (IsHiragana("あ") = True)
MsgBox (IsHiragana("ア") = False)
MsgBox (IsKatakana("あ") = False)
MsgBox (IsKatakana("ア") = True)
End Sub

Sub Furigana()
  Dim line As Integer
  
  Dim wordcol, keycol As Integer
  Dim poscol, transcol As Integer
  Dim manualfuricol, autofuricol As Integer
  Dim alertfuricol, fullfuricol, pendingfuricol, charfuricol As Integer
  wordcol = 1
  Cells(1, wordcol).Value = "word"
  keycol = wordcol + 1
  Cells(1, keycol).Value = "key"
  poscol = keycol + 1
  Cells(1, poscol).Value = "pos"
  transcol = poscol + 1
  Cells(1, transcol).Value = "trans"
  bookcol = transcol + 1
  Cells(1, bookcol).Value = "book"
  chapcol = bookcol + 1
  Cells(1, chapcol).Value = "chap"
  inchapcol = chapcol + 1
  Cells(1, inchapcol).Value = "inchap"
  manualfuricol = inchapcol + 1
  Cells(1, manualfuricol).Value = "manualfuri"
  autofuricol = manualfuricol + 1
  Cells(1, autofuricol).Value = "autofuri"
  fullfuricol = autofuricol + 1
  Cells(1, fullfuricol).Value = "fullfuri"
  pendingfuricol = fullfuricol + 1
  Cells(1, pendingfuricol).Value = "pendingfuri"
  charfuricol = pendingfuricol + 1
  Cells(1, charfuricol).Value = "charfuri"
  
  Dim maxline As Integer
  maxline = 60
  
  Dim wordstr As String
  
  ' Calculate
  For line = 2 To maxline
    If Cells(line, manualfuricol).Value <> "manual" And Cells(line, manualfuricol).Value <> "special" Then
      wordstr = Cells(line, wordcol).Value
    
      ' Split chars for furigana
      For charid = 1 To Len(wordstr)
        Cells(line, charfuricol + charid * 2).Value = Mid(wordstr, charid, 1)
        Cells(line, charfuricol + charid * 2).Phonetics.Visible = True
        Cells(line, charfuricol + charid * 2).Phonetics.CharacterType = xlHiragana
        Cells(line, charfuricol + charid * 2).SetPhonetic
        Cells(line, charfuricol + charid * 2 + 1).Value = Cells(line, charfuricol + charid * 2).Phonetic.Text
      Next charid
    End If
  Next line
  
  ' Verify
  For line = 2 To maxline
    ' Evaluate final answer
    Cells(line, wordcol).Phonetics.Visible = True
    Cells(line, wordcol).Phonetics.CharacterType = xlHiragana
    Cells(line, wordcol).SetPhonetic
    Cells(line, fullfuricol).Value = Cells(line, wordcol).Phonetic.Text
    
    ' Evaluate combined answer
    wordstr = Cells(line, wordcol).Value
    Cells(line, pendingfuricol).Value = ""
    For charid = 1 To Len(wordstr)
      Cells(line, pendingfuricol).Value = Cells(line, pendingfuricol).Value & Cells(line, charfuricol + charid * 2 + 1).Value
    Next charid
    
    Cells(line, autofuricol).Value = ""
    If Cells(line, fullfuricol).Value = Cells(line, pendingfuricol).Value Then
      If Cells(line, manualfuricol).Value <> "manual" Then
        Cells(line, autofuricol).Value = "auto"
      End If
    Else
      If Cells(line, manualfuricol).Value <> "" And Cells(line, manualfuricol).Value <> "special" Then
        Cells(line, autofuricol).Value = "ALERT"
      End If
    End If
  Next line
  
  
End Sub


