library(readr)

df <- read_csv("data.csv")

dim(df)
View(df)

#YearStart
max_YearStart <- max(df$YearStart)
max_YearStart
min_YearStart <- min(df$YearStart)
min_YearStart
unique(df$YearStart)

#YearEnd
max_YearEnd <- max(df$YearEnd)
max_YearEnd
min_YearEnd <- min(df$YearEnd)
min_YearEnd
unique(df$YearEnd)

#LocationAbbr
unique(df$LocationAbbr)

#LocationDesc
unique(df$LocationDesc)
length(unique(df$LocationDesc))

#Datasource
unique(df$Datasource)

#Class
unique(df$Class)

#Topic
unique(df$Topic)

#Question
unique(df$Question)
total_unique_Question <- length(unique(df$Question))
total_unique_Question

#Data_Value_Unit
unique(df$Data_Value_Unit)
total_unique_Data_Value_Unit <- length(unique(df$Data_Value_Unit))
total_unique_Data_Value_Unit

#Data_Value_Type
unique(df$Data_Value_Type	)

#Data_Value
unique(df$Data_Value)
total_unique_Data_Value <- length(unique(df$Data_Value))
total_unique_Data_Value

#Data_Value_Alt
unique(df$Data_Value_Alt)
total_unique_Data_Value_Alt <- length(unique(df$Data_Value_Alt))
total_unique_Data_Value_Alt


# Check if values in 'Data_Value' are equal to values in 'Data_Value_Alt' in the same order

are_equal <- all.equal(df$Data_Value, df$Data_Value_Alt)
are_equal

# Print the result
if (is.logical(are_equal) && all(are_equal)) {
  cat("TThe values in 'Data_Value' and 'Data_Value_Alt' are exactly the same.")
} else {
  cat("The values in 'NumericColumn1' and 'Data_Value_Alt' are not exactly the same.")
}

#Data_Value_Footnote_Symbol
unique(df$Data_Value_Footnote_Symbol)


#Data_Value_Footnote
unique(df$Data_Value_Footnote)
total_unique_Data_Value_Footnote <- length(unique(df$Data_Value_Footnote))
total_unique_Data_Value_Footnote

#Low_Confidence_Limit
unique(df$Low_Confidence_Limit)
total_unique_Low_Confidence_Limit <- length(unique(df$Low_Confidence_Limit))
total_unique_Low_Confidence_Limit

#High_Confidence_Limit
unique(df$High_Confidence_Limit )
total_unique_High_Confidence_Limit  <- length(unique(df$High_Confidence_Limit ))
total_unique_High_Confidence_Limit

#Sample_Size
unique(df$Sample_Size)
total_unique_Sample_Size <- length(unique(df$Sample_Size))
total_unique_Sample_Size
length(df$Sample_Size)

#Total
unique(df$Total)
total_unique_Total <- length(unique(df$Total))
total_unique_Total

#Age(years)
unique(df$"Age(years)")
total_unique_Age <- length(unique(df$"Age(years)"))
total_unique_Age

#Education
unique(df$Education)
total_unique_Education <- length(unique(df$Education))
total_unique_Education


#Gender
unique(df$Gender)
total_unique_Gender <- length(unique(df$Gender))
total_unique_Gender

#Income
unique(df$Income)
total_unique_Income <- length(unique(df$Income))
total_unique_Income

#Race/Ethnicity
unique(df$"Race/Ethnicity")
total_unique_Race <- length(unique(df$"Race/Ethnicity"))
total_unique_Race

#GeoLocation
unique(df$GeoLocation)
total_unique_GeoLocation <- length(unique(df$GeoLocation))
total_unique_GeoLocation

#ClassID
unique(df$ClassID)
total_unique_ClassID <- length(unique(df$ClassID))
total_unique_ClassID

#TopicID
unique(df$TopicID)
total_unique_TopicID<- length(unique(df$TopicID))
total_unique_TopicID

#QuestionID
unique(df$QuestionID)
total_unique_QuestionID <- length(unique(df$QuestionID))
total_unique_QuestionID

#DataValueTypeID
unique(df$DataValueTypeID) #drop this
total_unique_DataValueTypeID <- length(unique(df$DataValueTypeID))
total_unique_DataValueTypeID

#LocationID
unique(df$LocationID)
total_unique_LocationID <- length(unique(df$LocationID))
total_unique_LocationID

#StratificationCategory1
unique(df$StratificationCategory1)
total_unique_StratificationCategory1 <- length(unique(df$StratificationCategory1))
total_unique_StratificationCategory1

#Stratification1
unique(df$Stratification1)
total_unique_Stratification1 <- length(unique(df$Stratification1))
total_unique_Stratification1


#StratificationCategoryId1
unique(df$StratificationCategoryId1)
total_unique_StratificationCategoryId1 <- length(unique(df$StratificationCategoryId1))
total_unique_StratificationCategoryId1


#StratificationID1
unique(df$StratificationID1)
total_unique_StratificationID1 <- length(unique(df$StratificationID1))
total_unique_StratificationID1


#################################################
#Analysis of missing values:

library(dplyr)
library(tibble)
library(tidyr)
library(ggplot2)
library(forcats)
library(tidyverse)
library(redav)
set.seed(5702)

# Convert blank values to NA
df <- df %>%
  mutate_if(is.character, na_if, "")


# Calculate percentage of missing rows for each column
missing_percentage <- colMeans(is.na(df)) * 100

# Create a bar chart
ggplot(data.frame(variable = names(missing_percentage), missing_percentage),
       aes(x = reorder(variable, missing_percentage), y = missing_percentage)) +
  geom_bar(stat = "identity", fill = "steelblue", width = 0.5) +
  labs(x = "Variable", y = "Percentage of Missing Rows") +
  theme_minimal() +
  coord_flip() +
  scale_y_continuous(limits = c(0, 100), breaks = seq(0, 100, by = 10))
############################################################################
library(ggplot2)

plot_missing(df, percent = TRUE)


