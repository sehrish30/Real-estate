import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import getAgencyDetails from "../../Shared/Services/ProfileServices";

const AgencyDetail = ({ agencyId }) => {
  const [agency, setAgency] = useState({});
  useFocusEffect(
    useCallback(() => {
      const getService = async () => {
        const res = await getAgencyDetails();
        setAgency(res);
      };
      getService();
      return () => unsubscribe();
    }, [userId])
  );
  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default AgencyDetail;

const styles = StyleSheet.create({});
