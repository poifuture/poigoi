Attribute VB_Name = "Furigana"

Function Inc(ByRef i As Integer)
  Inc = i
  i = i + 1
End Function

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

Sub Furigana()
  Dim nowCol As Integer
  nowCol = 1

  WordCol = Inc(nowCol)
  WordKeyCol = Inc(nowCol)
  ToneCol = Inc(nowCol)
  PosCol = Inc(nowCol)
  ZhTranslationCol = Inc(nowCol)
  ZhHintCol = Inc(nowCol)
  KanaCol = Inc(nowCol)
  RomajiCol = Inc(nowCol)
  WapuroCol = Inc(nowCol)
  BookNameCol = Inc(nowCol)
  BookSeriesCol = Inc(nowCol)
  BookChapterCol = Inc(nowCol)
  BookChapterExtraCol = Inc(nowCol)
  BookChapterWordIdCol = Inc(nowCol)
  RubyManualTagCol = Inc(nowCol)
  RubyAutoTagCol = Inc(nowCol)
  RubyByExcelCol = Inc(nowCol)
  RubyByConcatCol = Inc(nowCol)
  RubyForCharsCol = Inc(nowCol)
  Cells(1, WordCol).Value = "Word"
  Cells(1, WordKeyCol).Value = "WordKey"
  Cells(1, ToneCol).Value = "Tone"
  Cells(1, PosCol).Value = "POS"
  Cells(1, ZhTranslationCol).Value = "ZhTranslation"
  Cells(1, ZhHintCol).Value = "ZhHint"
  Cells(1, KanaCol).Value = "Kana"
  Cells(1, RomajiCol).Value = "Romaji"
  Cells(1, WapuroCol).Value = "Wapuro"
  Cells(1, BookNameCol).Value = "BookName"
  Cells(1, BookSeriesCol).Value = "BookSeries"
  Cells(1, BookChapterCol).Value = "BookChapter"
  Cells(1, BookChapterExtraCol).Value = "BookExtra"
  Cells(1, BookChapterWordIdCol).Value = "BookWordId"
  Cells(1, RubyManualTagCol).Value = "ManualTags"
  Cells(1, RubyAutoTagCol).Value = "AutoTags"
  Cells(1, RubyByExcelCol).Value = "RubyByExcel"
  Cells(1, RubyByConcatCol).Value = "RubyByConcat"
  Cells(1, RubyForCharsCol).Value = "=IF(Q1=T1,IF(AND(O1="""",P1=""""),""manual"",""c""),IF(O1=""special"",""s"",""ALERT""))"
  Cells(1, RubyForCharsCol+1).Value = "=CONCAT(V1,X1,Z1,AB1,AD1,AF1,AH1,AJ1,AL1,AN1,AP1)"
  
  Dim line As Integer
  Dim maxline As Integer
  maxline = Cells(1, 1).End(xlDown).Row
  
  Dim wordstr As String
  
  ' Calculate
  For line = 2 To maxline
    If Cells(line, RubyManualTagCol).Value <> "manual" And Cells(line, RubyManualTagCol).Value <> "special" Then
      wordstr = Cells(line, WordCol).Value
    
      ' Split chars for furigana
      For charid = 1 To Len(wordstr)
        Cells(line, RubyForCharsCol + charid * 2).Value = Mid(wordstr, charid, 1)
        Cells(line, RubyForCharsCol + charid * 2).Phonetics.Visible = True
        Cells(line, RubyForCharsCol + charid * 2).Phonetics.CharacterType = xlHiragana
        Cells(line, RubyForCharsCol + charid * 2).SetPhonetic
        Cells(line, RubyForCharsCol + charid * 2 + 1).Value = Cells(line, RubyForCharsCol + charid * 2).Phonetic.Text
      Next charid
    End If
  Next line
  
  ' Verify
  For line = 2 To maxline
    ' Evaluate final answer
    Cells(line, WordCol).Phonetics.Visible = True
    Cells(line, WordCol).Phonetics.CharacterType = xlHiragana
    Cells(line, WordCol).SetPhonetic
    Cells(line, RubyByExcelCol).Value = Cells(line, WordCol).Phonetic.Text
    
    ' Evaluate combined answer
    wordstr = Cells(line, WordCol).Value
    Cells(line, RubyByConcatCol).Value = ""
    For charid = 1 To Len(wordstr)
      Cells(line, RubyByConcatCol).Value = Cells(line, RubyByConcatCol).Value & Cells(line, RubyForCharsCol + charid * 2 + 1).Value
    Next charid
    
    Cells(line, RubyAutoTagCol).Value = ""
    If Cells(line, RubyByExcelCol).Value = Cells(line, RubyByConcatCol).Value Then
      If Cells(line, RubyManualTagCol).Value <> "manual" Then
        Cells(line, RubyAutoTagCol).Value = "auto"
      End If
    Else
      If Cells(line, RubyManualTagCol).Value <> "" And Cells(line, RubyManualTagCol).Value <> "special" Then
        Cells(line, RubyAutoTagCol).Value = "ALERT"
      End If
    End If
  Next line
  
  
End Sub


