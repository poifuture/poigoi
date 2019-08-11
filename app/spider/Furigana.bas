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

  InputWordCol = Inc(nowCol)
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

  nowCol=31 'AE
  CommonWordCol = Inc(nowCol)
  RubyManualTagCol = Inc(nowCol)
  RubyAutoTagCol = Inc(nowCol)
  RubyByExcelCol = Inc(nowCol)
  RubyByConcatCol = Inc(nowCol)
  RubyForCharsCol = Inc(nowCol)
  nowCol=61 ' BI
  AlterWordCol = Inc(nowCol)
  AlterRubyManualTagCol = Inc(nowCol)
  AlterRubyAutoTagCol = Inc(nowCol)
  AlterRubyByExcelCol = Inc(nowCol)
  AlterRubyByConcatCol = Inc(nowCol)
  AlterRubyForCharsCol = Inc(nowCol)
  nowCol=91 ' CT
  UncommonWordCol = Inc(nowCol)
  UncommonRubyManualTagCol = Inc(nowCol)
  UncommonRubyAutoTagCol = Inc(nowCol)
  UncommonRubyByExcelCol = Inc(nowCol)
  UncommonRubyByConcatCol = Inc(nowCol)
  UncommonRubyForCharsCol = Inc(nowCol)

  Cells(1, InputWordCol).Value = "InputWord"
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
  Cells(1, 30).Value = "30"
  Cells(1, CommonWordCol).Value = "CommonWord"
  Cells(1, RubyManualTagCol).Value = "ManualTags"
  Cells(1, RubyAutoTagCol).Value = "AutoTags"
  Cells(1, RubyByExcelCol).Value = "RubyByExcel"
  Cells(1, RubyByConcatCol).Value = "RubyByConcat"
  Cells(1, RubyForCharsCol).Value = "=IF(AF1=""special"",""special"",IF(AH1=AK1,IF(AND(AF1="""",AG1=""""),""manual"",""""),""ALERT""))"
  Cells(1, RubyForCharsCol+1).Value = "=CONCAT(AM1,AO1,AQ1,AS1,AU1,AW1,AY1,BA1,BC1,BE1,BG1)"
  Cells(1, 60).Value = "60"
  Cells(1, AlterWordCol).Value = "AlterWord"
  Cells(1, AlterRubyManualTagCol).Value = "ManualTags"
  Cells(1, AlterRubyAutoTagCol).Value = "AutoTags"
  Cells(1, AlterRubyByExcelCol).Value = "RubyByExcel"
  Cells(1, AlterRubyByConcatCol).Value = "RubyByConcat"
  Cells(1, AlterRubyForCharsCol).Value = "=IF(BJ1=""special"",""special"",IF(BL1=BO1,IF(AND(BJ1="""",BK1=""""),""manual"",""""),""ALERT""))"
  Cells(1, AlterRubyForCharsCol+1).Value = "=CONCAT(BQ1,BS1,BU1,BW1,BY1,CA1,CC1,CE1,CG1,CI1,CK1)"
  Cells(1, 90).Value = "90"
  Cells(1, UncommonWordCol).Value = "UncommonWord"
  Cells(1, UncommonRubyManualTagCol).Value = "ManualTags"
  Cells(1, UncommonRubyAutoTagCol).Value = "AutoTags"
  Cells(1, UncommonRubyByExcelCol).Value = "RubyByExcel"
  Cells(1, UncommonRubyByConcatCol).Value = "RubyByConcat"
  Cells(1, UncommonRubyForCharsCol).Value = "=IF(CN1=""special"",""special"",IF(CP1=CS1,IF(AND(CN1="""",CO1=""""),""manual"",""""),""ALERT""))"
  Cells(1, UncommonRubyForCharsCol+1).Value = "=CONCAT(CU1,CW1,CY1,DA1,DC1,DE1,DG1,DI1,DK1,DM1,DO1)"
  
  Dim line As Integer
  Dim maxline As Integer
  maxline = Cells(1, 1).End(xlDown).Row
  
  Dim wordstr As String
  
  For line = 2 To maxline
    Cells(line, CommonWordCol).Value = Cells(line, InputWordCol).Value
  Next line
  ' Calculate
  For line = 2 To maxline
    If Cells(line, RubyManualTagCol).Value <> "manual" And Cells(line, RubyManualTagCol).Value <> "special" Then
      wordstr = Cells(line, CommonWordCol).Value
    
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
    Cells(line, CommonWordCol).Phonetics.Visible = True
    Cells(line, CommonWordCol).Phonetics.CharacterType = xlHiragana
    Cells(line, CommonWordCol).SetPhonetic
    Cells(line, RubyByExcelCol).Value = Cells(line, CommonWordCol).Phonetic.Text
    
    ' Evaluate combined answer
    wordstr = Cells(line, CommonWordCol).Value
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


